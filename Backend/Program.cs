using System.Text;
using System.Threading.RateLimiting;
using GaziTeknoparkApi.Data;
using GaziTeknoparkApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection ayarı boş. Backend/appsettings.Development.json dosyasını oluşturup " +
        "gerçek MySQL bağlantı bilgilerini girin (bu dosya .gitignore'da, ekipten alınmalı veya yerel olarak oluşturulmalı).");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 30)))
           .UseSnakeCaseNamingConvention());

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("X-Total-Count", "x-total-count", "X-Total-Pages", "X-Current-Page", "X-Page-Size"));
});

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// reCAPTCHA doğrulama servisi
builder.Services.AddHttpClient<IRecaptchaService, RecaptchaService>();

// Rate Limiting — Staj başvurusu için: 1 saatte aynı IP'den en fazla 5 istek
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("internship-submit", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromHours(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync(
            "{\"message\": \"Çok fazla başvuru denemesi yapıldı. Lütfen 1 saat sonra tekrar deneyiniz.\"}",
            cancellationToken);
    };
});

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "Jwt:Key ayarı boş. Backend/appsettings.Development.json dosyasını oluşturup gerçek bir JWT anahtarı girin " +
        "(bu dosya .gitignore'da, ekipten alınmalı veya yerel olarak oluşturulmalı).");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Veritabanı tabloları eksikse backend çalışırken otomatik olarak oluşturur (Auto Migration)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
        DbSeeder.Seed(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Auto-Migrate Error]: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseStaticFiles();

app.UseRateLimiter();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

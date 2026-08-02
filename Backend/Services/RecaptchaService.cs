using System.Text.Json.Serialization;

namespace GaziTeknoparkApi.Services;

public class RecaptchaService : IRecaptchaService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<RecaptchaService> _logger;

    public RecaptchaService(HttpClient http, IConfiguration config, ILogger<RecaptchaService> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public async Task<bool> VerifyAsync(string token)
    {
        var secretKey = _config["Recaptcha:SecretKey"];

        // SecretKey yapılandırılmamışsa veya development/test key ise geçiş ver
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            _logger.LogWarning("Recaptcha:SecretKey yapılandırılmamış. reCAPTCHA doğrulaması atlandı.");
            return true;
        }

        try
        {
            var response = await _http.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}",
                null);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("reCAPTCHA API isteği başarısız: {StatusCode}", response.StatusCode);
                return false;
            }

            var result = await response.Content.ReadFromJsonAsync<RecaptchaApiResponse>();

            if (result is null)
            {
                _logger.LogWarning("reCAPTCHA API yanıtı ayrıştırılamadı.");
                return false;
            }

            // v2 checkbox için score yoktur; v3 için score >= 0.5 şartı
            if (result.Score.HasValue && result.Score.Value < 0.5f)
            {
                _logger.LogWarning("reCAPTCHA score çok düşük: {Score}", result.Score.Value);
                return false;
            }

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "reCAPTCHA doğrulaması sırasında hata oluştu.");
            // Harici servis hatası durumunda uygulamayı engelleme; loglayıp geçiş ver
            return true;
        }
    }

    private sealed record RecaptchaApiResponse(
        [property: JsonPropertyName("success")] bool Success,
        [property: JsonPropertyName("score")] float? Score,
        [property: JsonPropertyName("action")] string? Action,
        [property: JsonPropertyName("error-codes")] List<string>? ErrorCodes
    );
}

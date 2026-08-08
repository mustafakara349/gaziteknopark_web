using System.Xml.Linq;

namespace GaziTeknoparkApi.Services;

public class ArgePortalService : IArgePortalService
{
    private const string XmlUrl = "https://argeportal.gaziteknopark.com.tr/XML/GetFirmaXmlData";

    // In-memory cache: 30 dakikada bir yenilenir
    private static ArgePortalStats? _cache;
    private static DateTime _cacheExpiry = DateTime.MinValue;
    private static readonly SemaphoreSlim _lock = new(1, 1);

    private readonly HttpClient _http;
    private readonly ILogger<ArgePortalService> _logger;

    public ArgePortalService(HttpClient http, ILogger<ArgePortalService> logger)
    {
        _http = http;
        _logger = logger;
    }

    public async Task<ArgePortalStats> GetIstatistiklerAsync()
    {
        // Geçerli cache varsa döndür
        if (_cache is not null && DateTime.UtcNow < _cacheExpiry)
            return _cache;

        await _lock.WaitAsync();
        try
        {
            // Double-check lock
            if (_cache is not null && DateTime.UtcNow < _cacheExpiry)
                return _cache;

            _logger.LogInformation("[ArgePortal] XML verisi çekiliyor (Yalnızca istatistikler için)...");
            var xml = await _http.GetStringAsync(XmlUrl);
            var stats = ParseXmlForStats(xml);

            _cache = stats;
            _cacheExpiry = DateTime.UtcNow.AddMinutes(30);

            _logger.LogInformation("[ArgePortal] İstatistikler başarıyla güncellendi. Toplam Firma: {Count}", stats.ToplamFirma);
            return stats;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[ArgePortal] XML verisi çekilirken hata oluştu.");

            // Eski cache varsa hata durumunda onu döndür
            if (_cache is not null)
                return _cache;

            // Hiç cache yoksa boş dön, uygulama çökmez
            return new ArgePortalStats();
        }
        finally
        {
            _lock.Release();
        }
    }

    private static ArgePortalStats ParseXmlForStats(string xml)
    {
        var doc = XDocument.Parse(xml);
        
        int toplamFirma = 0;
        int toplamPersonel = 0;
        int toplamProje = 0;

        foreach (var row in doc.Descendants("row"))
        {
            toplamFirma++;
            
            if (int.TryParse(row.Element("ToplamPersonelSayisi")?.Value, out var tp))
            {
                toplamPersonel += tp;
            }
            
            if (int.TryParse(row.Element("ToplamProjeSayisi")?.Value, out var pp))
            {
                toplamProje += pp;
            }
        }

        return new ArgePortalStats
        {
            ToplamFirma = toplamFirma,
            ToplamPersonel = toplamPersonel,
            ToplamProje = toplamProje
        };
    }
}

namespace GaziTeknoparkApi.Services;

public interface IArgePortalService
{
    Task<ArgePortalStats> GetIstatistiklerAsync();
}

public class ArgePortalStats
{
    public int ToplamFirma { get; set; }
    public int ToplamPersonel { get; set; }
    public int ToplamProje { get; set; }
}

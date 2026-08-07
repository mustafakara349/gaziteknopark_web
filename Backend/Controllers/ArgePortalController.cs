using GaziTeknoparkApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace GaziTeknoparkApi.Controllers;

/// <summary>
/// ArGe Portal istatistiklerini proxy eden controller.
/// </summary>
[ApiController]
[Route("api/argeportal")]
public class ArgePortalController : ControllerBase
{
    private readonly IArgePortalService _svc;

    public ArgePortalController(IArgePortalService svc)
    {
        _svc = svc;
    }

    /// <summary>
    /// Yalnızca özet istatistikleri döner (anasayfa için).
    /// GET /api/argeportal/istatistikler
    /// </summary>
    [HttpGet("istatistikler")]
    public async Task<IActionResult> GetIstatistikler()
    {
        var stats = await _svc.GetIstatistiklerAsync();
        return Ok(stats);
    }
}

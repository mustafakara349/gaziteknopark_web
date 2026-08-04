using GaziTeknoparkApi.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GaziTeknoparkApi.Controllers;

[ApiController]
[Route("api/international-offices")]
public class InternationalOfficesController : ControllerBase
{
    private static readonly List<InternationalOfficeDto> Offices = new()
    {
        new InternationalOfficeDto
        {
            Id = "ankara",
            City = "Ankara",
            Country = "Türkiye",
            CountryCode = "TR",
            Flag = "🇹🇷",
            Title = "Gazi Teknopark Genel Merkez & Ar-Ge Kampüsü",
            Badge = "Genel Merkez & Ar-Ge Kampüsü",
            Phone = "+90 312 212 90 00",
            Email = "info@gaziteknopark.com.tr",
            Address = "Gazi Üniversitesi Gölbaşı Yerleşkesi, Bahçelievler Mah. 35. Cadde No: 9, 06830 Gölbaşı / ANKARA",
            Website = "https://www.gaziteknopark.com.tr",
            Latitude = 39.9334,
            Longitude = 32.8597
        },
        new InternationalOfficeDto
        {
            Id = "london",
            City = "London",
            Country = "İngiltere",
            CountryCode = "GB",
            Flag = "🇬🇧",
            Title = "Londra İrtibat & Hızlandırma Ofisi",
            Badge = "Avrupa İrtibat Ofisi",
            Phone = "+44 20 7946 0912",
            Email = "london@gaziteknopark.com.tr",
            Address = "London Tech Hub, 100 Bishopsgate, EC2N 4AG, London / UNITED KINGDOM",
            Website = "https://london.gaziteknopark.com.tr",
            Latitude = 51.5074,
            Longitude = -0.1278
        },
        new InternationalOfficeDto
        {
            Id = "amsterdam",
            City = "Amsterdam",
            Country = "Hollanda",
            CountryCode = "NL",
            Flag = "🇳🇱",
            Title = "Amsterdam İnovasyon & Teknoloji Ofisi",
            Badge = "Avrupa İnovasyon Ofisi",
            Phone = "+31 20 794 8000",
            Email = "amsterdam@gaziteknopark.com.tr",
            Address = "Amsterdam Science Park 400, 1098 XH Amsterdam / NETHERLANDS",
            Website = "https://amsterdam.gaziteknopark.com.tr",
            Latitude = 52.3676,
            Longitude = 4.9041
        },
        new InternationalOfficeDto
        {
            Id = "dubai",
            City = "Dubai",
            Country = "Birleşik Arap Emirlikleri",
            CountryCode = "AE",
            Flag = "🇦🇪",
            Title = "Dubai Teknoloji & Ticaret Ofisi",
            Badge = "Orta Doğu İrtibat Ofisi",
            Phone = "+971 4 312 8000",
            Email = "dubai@gaziteknopark.com.tr",
            Address = "Dubai Future District, DIFC Gate Precinct 4, Level 5, Dubai / UAE",
            Website = "https://dubai.gaziteknopark.com.tr",
            Latitude = 25.2048,
            Longitude = 55.2708
        }
    };

    [HttpGet]
    public ActionResult<IEnumerable<InternationalOfficeDto>> GetOffices()
    {
        return Ok(Offices);
    }
}

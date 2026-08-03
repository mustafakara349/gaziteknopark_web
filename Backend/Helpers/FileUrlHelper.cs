using GaziTeknoparkApi.Models;
using Microsoft.AspNetCore.Http;

namespace GaziTeknoparkApi.Helpers;

public static class FileUrlHelper
{
    public static string? ToAbsoluteUrl(HttpRequest request, FileAsset? file)
    {
        if (file is null || string.IsNullOrWhiteSpace(file.Path))
        {
            return null;
        }

        var relativePath = file.Path.Replace('\\', '/').TrimStart('/');
        return $"{request.Scheme}://{request.Host}/{relativePath}";
    }
}

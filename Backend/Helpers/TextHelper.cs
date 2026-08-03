using System.Text.RegularExpressions;

namespace GaziTeknoparkApi.Helpers;

public static class TextHelper
{
    private static readonly Regex HtmlTagRegex = new("<.*?>", RegexOptions.Compiled);
    private static readonly Regex WhitespaceRegex = new(@"\s+", RegexOptions.Compiled);

    // Kart görünümündeki kısa açıklama için HTML etiketlerini temizler ve belirli bir uzunlukta keser.
    public static string? ToPlainSummary(string? text, int maxLength = 160)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var plain = HtmlTagRegex.Replace(text, " ");
        plain = WhitespaceRegex.Replace(plain, " ").Trim();

        if (plain.Length <= maxLength)
        {
            return plain;
        }

        return plain[..maxLength].TrimEnd() + "…";
    }
}

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

    // Türkçe karakter destekli URL dostu metin (Slug) üretir.
    public static string Slugify(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return string.Empty;
        }

        text = text.ToLowerInvariant();

        text = text.Replace("ş", "s")
                   .Replace("ı", "i")
                   .Replace("ğ", "g")
                   .Replace("ü", "u")
                   .Replace("ö", "o")
                   .Replace("ç", "c");

        // Harf, rakam, boşluk ve tire harici karakterleri sil
        text = Regex.Replace(text, @"[^a-z0-9\s-]", "");

        // Çoklu boşlukları ve tireleri tek bir tireye dönüştür
        text = Regex.Replace(text, @"[\s-]+", "-").Trim('-');

        return text;
    }
}

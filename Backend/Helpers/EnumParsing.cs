namespace GaziTeknoparkApi.Helpers;

public static class EnumParsing
{
    public static bool TryParse<TEnum>(string? value, out TEnum result) where TEnum : struct, Enum
    {
        return Enum.TryParse(value, true, out result);
    }
}

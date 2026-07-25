using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GaziTeknoparkApi.Models.Enums;

public class LowerCaseEnumConverter<TEnum> : ValueConverter<TEnum, string> where TEnum : struct, Enum
{
    public LowerCaseEnumConverter() : base(
        v => v.ToString().ToLowerInvariant(),
        v => Enum.Parse<TEnum>(v, true))
    {
    }
}

public class UserTypeConverter : ValueConverter<UserType, string>
{
    public UserTypeConverter() : base(
        v => v == UserType.ArgePortal ? "arge_portal" : v.ToString().ToLowerInvariant(),
        v => v == "arge_portal" ? UserType.ArgePortal : Enum.Parse<UserType>(v, true))
    {
    }
}

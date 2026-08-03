namespace GaziTeknoparkApi.Services;

public interface IRecaptchaService
{
    Task<bool> VerifyAsync(string token);
}

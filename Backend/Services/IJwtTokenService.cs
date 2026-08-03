using GaziTeknoparkApi.Models;

namespace GaziTeknoparkApi.Services;

public interface IJwtTokenService
{
    string GenerateToken(User user, out DateTime expiresAt);
    string GenerateRefreshToken();
}

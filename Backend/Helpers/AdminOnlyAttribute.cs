using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GaziTeknoparkApi.Helpers;

/// <summary>
/// Authorization filter that allows only users with UserType "Admin" to access the endpoint.
/// Must be used together with [Authorize] attribute.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var userTypeClaim = context.HttpContext.User.FindFirst("user_type");

        if (userTypeClaim is null || !userTypeClaim.Value.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            context.Result = new JsonResult(new { message = "Bu işlem için yönetici yetkisi gereklidir." })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}

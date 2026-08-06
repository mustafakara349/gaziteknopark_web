using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace GaziTeknoparkApi.Helpers;

/// <summary>
/// Authorization filter that allows only users whose effective role is "Admin" (i.e. no
/// Role assigned that downgrades them, e.g. to "Editor"). Must be used together with [Authorize].
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.User.IsInRole("Admin"))
        {
            context.Result = new JsonResult(new { message = "Bu işlem için yönetici yetkisi gereklidir." })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}

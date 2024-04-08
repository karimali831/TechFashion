using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImportController(IProductImportService productImportService) : ControllerBase
    {
        private readonly IProductImportService _productImportService = productImportService;

        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = 234217728)]
        [HttpPost("Upload")]
        public IActionResult CsvUpload()
        {
            var file = HttpContext.Request.Form.Files;
            _productImportService.DoAsync(file[0]);

            return NoContent();
        }
    }

}
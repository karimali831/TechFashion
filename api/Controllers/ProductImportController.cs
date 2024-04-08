using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImportController : ControllerBase
    {
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = 234217728)]
        [HttpPost("Upload")]
        public async Task<ActionResult> CsvUpload()
        {
            var uploadedFiles = HttpContext.Request.Form.Files;
            foreach (var uploadedFile in uploadedFiles)
            {
                string fileFullPath = @"../sometempfolder/tempfile.txt";
                if (System.IO.File.Exists(fileFullPath))
                    System.IO.File.Delete(fileFullPath);

                using (FileStream stream = System.IO.File.Open(fileFullPath, FileMode.Create, FileAccess.Write))
                {
                    await uploadedFile.CopyToAsync(stream);
                }
                string csvContents = System.IO.File.ReadAllText(fileFullPath);
                // ProcessCSVFile(csvContents);
            }

            return Ok();
        }
    }
}
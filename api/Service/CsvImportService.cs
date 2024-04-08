
using System.Globalization;
using CsvHelper;

namespace api.Service
{
    public interface ICsvImportService
    {
        IList<T> Read<T>(IFormFile file);
    }

    public class CsvImportService : ICsvImportService
    {
        public IList<T> Read<T>(IFormFile file)
        {

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                return csv.GetRecords<T>().ToList();

                // csv.Read();
                // csv.ReadHeader();

                // while (csv.Read())
                // {
                //     var record = csv.GetRecord<T>();

                // }
            }

        }
    }
}
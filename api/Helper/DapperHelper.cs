using System.Text;
using Dapper;

namespace api.Helper
{
    public static class DapperHelper
    {
        // returns list of fields from model type
        // except props with DbIgnore attribute
        public static string[] SqlFields(this Type type)
        {
            return type.GetProperties()
                .Where(x => x.CustomAttributes.All(a => a.AttributeType != typeof(DbIgnoreAttribute)))
                .Select(x =>
                {
                    var attrs = x.GetCustomAttributes(true);

                    foreach (var attr in attrs)
                    {
                        if (attr is HasColumnNameAttribute attribute)
                        {
                            return $"{attribute.ColumnName} AS {x.Name}";
                        }
                    }

                    return x.Name;
                }).ToArray();
        }

        public static string SELECT(string table, string[] fields, int? top = null)
        {
            return $"SELECT {(top.HasValue ? $"TOP" + $" {top.Value}" : "")} {string.Join(",", fields)} FROM {table}";
        }

        public static string COUNT(string table, StringBuilder? filter = null)
        {
            return $"SELECT COUNT(*) AS TotalItems FROM {table} {filter}";
        }

        public static string SUM(string table, string column, StringBuilder? filter = null)
        {
            return $"SELECT SUM({column}) FROM {table} {filter}";
        }

        public static string INSERT(string table, string[] fields)
        {
            return $"INSERT INTO {table} ({string.Join(", ", fields)}) VALUES ({string.Join(", ", fields.Select(f => $"@{f}"))})";
        }

        public static string DELETE(string table)
        {
            return $"DELETE FROM {table}";
        }

        public static StringBuilder FILTER(this DynamicParameters parameters, (string[] Fields, string[] Values) searchTerm, string where = "")
        {
            var sqlTxt = new StringBuilder();

            if (!string.IsNullOrEmpty(where))
            {
                sqlTxt.Append($"WHERE {where}");
            }

            // build query filter dynamically and parametrise each field/value pair
            if (searchTerm.Fields.Any() && searchTerm.Values.Any())
            {
                sqlTxt.Append(string.IsNullOrEmpty(where) ? " WHERE " : " AND ");
                sqlTxt.Append('(');
                var z = 0;
                foreach (var field in searchTerm.Fields)
                {
                    var i = 0;
                    foreach (var value in searchTerm.Values)
                    {
                        sqlTxt.Append(i == 0 && z == 0 ? "" : " OR ")
                            .Append($"LOWER({field}) LIKE @p")
                            .Append(i);

                        parameters.Add("p" + i, "%" + value + "%");
                        i++;
                    }

                    z++;
                }
                sqlTxt.Append(')');
            }

            return sqlTxt;
        }
    }

    public class DbIgnoreAttribute : Attribute { }

    public abstract class HasColumnNameAttribute(string columnName) : Attribute
    {
        public string ColumnName { get; set; } = columnName;
    }
}
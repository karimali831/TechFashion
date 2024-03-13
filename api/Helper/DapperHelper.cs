using System.Reflection;
using System.Text;
using Dapper;

namespace api.Helper
{
    public static class DapperHelper
    {
        public static string[] DapperFields(this Type type)
        {
            return
                type
                    .GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy)
                    .Where(x => !x.CustomAttributes.Any(a => a.AttributeType == typeof(DbIgnoreAttribute)))
                    .Select(x => x.Name).ToArray();
        }


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

        public static string Select(string table, string[] fields, int? top = null)
        {
            return $";SELECT {(top.HasValue ? $"TOP" + $" {top.Value}" : "")} {string.Join(",", fields)} FROM {table}";
        }

        public static string Count(string table, StringBuilder? filter = null)
        {
            return $";SELECT COUNT(*) AS TotalItems FROM {table} {filter}";
        }

        public static string Sum(string table, string column, StringBuilder? filter = null)
        {
            return $";SELECT SUM({column}) FROM {table} {filter}";
        }


        public static string Update(string table, string[] fields, string? primaryKey = "Id")
        {
            return $"UPDATE {table} SET {string.Join(", ", fields.Where(f => f != primaryKey).Select(f => $"{f}=@{f}"))}";
        }

        public static string Insert(string table, string[] fields)
        {
            return $";INSERT INTO {table} ({string.Join(", ", fields)}) VALUES ({string.Join(", ", fields.Select(f => $"@{f}"))})";
        }

        public static string Delete(string table)
        {
            return $";DELETE FROM {table}";
        }

        public static StringBuilder Filter(this DynamicParameters parameters, (string[] Fields, string[] Values) searchTerm, string where = "")
        {
            var sqlTxt = new StringBuilder();

            if (!string.IsNullOrEmpty(where))
            {
                sqlTxt.Append($"WHERE {where}");
            }

            // build query filter dynamically and parametrise each field/value pair
            if (searchTerm.Fields.Length != 0 && searchTerm.Values.Length != 0)
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
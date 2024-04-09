using Slugify;

namespace api.Helper
{
    public static class StringHelper
    {
        public static string Base64Encode(this string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(this string base64EncodedData)
        {
            var base64EncodedBytes = Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static string GenerateSlug(this string text)
        {
            var slug = new SlugHelper().GenerateSlug(text);

            if (slug.EndsWith('-'))
            {
                slug = slug.Remove(slug.Length - 1, 1);
            }

            return slug;
        }
    }
}
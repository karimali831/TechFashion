using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Config
{
    public class EbayConfig
    {
        public string ApiToken { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string DevId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Config;
using Ebaysharp.Entities;
using Ebaysharp.Services;
using Microsoft.Extensions.Options;

namespace api.Service.Ebay
{
    public abstract class EbayBaseService(IOptions<EbayConfig> configuration)
    {
        private readonly IOptions<EbayConfig> _configuration = configuration;

        protected ClientToken GetClientToken()
        {
            return new ClientToken()
            {
                clientId = _configuration.Value.ClientId,
                clientSecret = _configuration.Value.ClientSecret,
                devId = _configuration.Value.DevId,
                oauthCredentials = _configuration.Value.ApiToken, // "Your clientId:clientSecret base64 encoded",
                ruName = "Your ruName from developer portal",
                scopes = "Space separated scopes from Ebay API"
            };
        }

        protected string GetRedirectUrl()
        {
            var state = "Your application/user state encoded url safe";
            return new OauthService(GetClientToken()).GetRedirectUrl(state);
        }

        protected async Task<AccessToken> GetAccessTokenAsync(string code)
        {
            var authService = new OauthService(GetClientToken());
            return await authService.GetAccessTokenAsync(code);
        }

        // protected async Task RefreshTokenAsync(string code)
        // {
        //     var accessToken = await GetAccessTokenAsync(code); //assuming this function returns AccessToken object with valid tokens
        //     var service = new Service(clientToken, accessToken);
        //     //after performing operation(s)
        //     if (service.IsAccessTokenRefreshed(accessToken.date_last_updated))
        //         service.AccessToken; //you can use this access token object to update tokens in your store
        // }
    }
}
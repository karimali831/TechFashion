using api;
using api.Auth;
using api.Config;
using api.Controllers;
using api.Data;
using api.Service;
using Ebaysharp;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile($"appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.WebHost.UseSentry();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

// Container for dependency injection
builder.Services.Modules();

// Configs
var ebayConfig = builder.Configuration.GetSection("Ebay");
builder.Services.Configure<EbayConfig>(ebayConfig);

builder.Services.AddDbContext<AppDatabaseContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Stripe
var stripeConfig = builder.Configuration.GetSection("Stripe");
builder.Services.Configure<StripeConfig>(stripeConfig);

StripeConfiguration.ApiKey = stripeConfig["SecretKey"];
// StripeConfiguration.ApiVersion <- f12 to see version

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins(
                "https://66171ef5c0c45800a2bfe77a--techfashion.netlify.app",
                "http://localhost:5173",
                "http://techfashion.netlify.app",
                "https://techfashion.netlify.app"
            )
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod();
        });
});

// forward headers configuration for reverse proxy
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddHttpClient<IpApiClient>();


// Hangfire
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddHangfire(configuration => configuration
    .UseSqlServerStorage(connectionString));

var sqlStorage = new SqlServerStorage(connectionString);

var options = new BackgroundJobServerOptions
{
    ServerName = "Test Server"
};
JobStorage.Current = sqlStorage;

builder.Services.AddHangfireServer();

EnvironemntManager.Environemnt = EnvironemntManager.Environments.Sandbox;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Hangfire
app.UseHangfireDashboard("/jobs", new DashboardOptions()
{
    Authorization = [new DashboardAuthorizationFilter()]
}, JobStorage.Current);


// BackgroundJob.Enqueue(() => Console.WriteLine("Hello world from Hangfire!"));

using var scope = app.Services.CreateScope();
RecurringJob.AddOrUpdate("Remove inactive carts",
    () => scope.ServiceProvider.GetRequiredService<ICartJobService>().RemoveInactiveCartsAsync(),
     // Cron.Minutely
     "*/15 * * * *"
);

// Sentry
app.UseRouting();
app.UseSentryTracing();

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();

SentrySdk.CaptureMessage("Hello Sentry - Elegance Craft project");

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

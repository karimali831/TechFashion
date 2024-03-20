using api;
using api.Config;
using api.Data;
using Ebaysharp;
using Microsoft.EntityFrameworkCore;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

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
                "http://localhost:5173",
                "http://techfashion.netlify.app",
                "https://techfashion.netlify.app"
            )
            .AllowAnyHeader()
            .AllowCredentials()
            .AllowAnyMethod();
        });
});


EnvironemntManager.Environemnt = EnvironemntManager.Environments.Sandbox;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

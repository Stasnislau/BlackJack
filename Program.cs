using System.Text;
// using database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<GameService>();
// builder.Services.AddScoped<AuthorizationService>();
builder.Services.AddHttpContextAccessor();

DotNetEnv.Env.Load();

// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL"))
// );
builder.Services.AddSignalR();
builder.Services.AddSingleton<GameSessionsManager>();


builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(x =>
    {
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "*",
            ValidAudience = "*",
            // IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET_KEY") ?? throw new InvalidOperationException("No secret key found"))),
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder => builder
        .WithOrigins(Environment.GetEnvironmentVariable("CLIENT_URL") ?? throw new InvalidOperationException("No client URL found")) // Add other origins as needed
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});
var app = builder.Build();
// app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<GameHub>("/gameHub");

// app.UseMiddleware<UserInfoMiddleware>();
app.Run();
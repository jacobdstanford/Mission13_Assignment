using Microsoft.EntityFrameworkCore;
using Mission11.Models;

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();



builder.Services.AddDbContext<BookstoreContext>(options =>
{

    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection"));
});




builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();



// Allow all CORS
app.UseCors("AllowAll");

app.MapControllers();

app.Run();

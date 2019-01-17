using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using DatingApp.API.Helpers;
using AutoMapper;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // adding our DataContext, to have possibility use it in controllers constructor
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(opt => { opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore; });

            //needed for sharing resourses from our backend api to angular in front 
            services.AddCors(options =>
                {
                    options.AddPolicy("AllowSpecificOrigin",
                        builder => builder.WithOrigins("http://localhost:4200")
                                           .AllowAnyHeader()
                                           .AllowAnyMethod());
                });

            // setting sonfiguration for claudinary
            // value of class CloudinarySettings will gonna match with appsettings.json "ClaudinarySettings
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

            //adding automapper
            services.AddAutoMapper();

            // adding our class with custom users
            services.AddTransient<Seed>();

            // addScoped create instance for each Http request
            // but uses the same instance in other cors what is in the same web request 
            // we must specify the interface what we want to use -> IAuthRepository
            // and implementation of this interface -> AuthRepository
            services.AddScoped<IAuthRepository, AuthRepository>();

            // as above
            services.AddScoped<IDatingRepository, DatingRepository>();

            // adding authentication type
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,

                    //Configuration.GetSection("AppSettings:Token").Value) is string
                    //Encoding.ASCII.GetBytes change string to byte[]
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),

                    ValidateIssuer = false,

                    ValidateAudience = false
                };
            });

            // adding ActionFilter Service
            services.AddScoped<LogUserActivity>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // adding global exception for production mode
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {

                            // adding custom method AddApplicationError from helpers/extensions to display error
                            context.Response.AddApplicationError(error.Error.Message);

                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //    app.UseHsts();
            }


            //  app.UseHttpsRedirection();

            // when application will start this automatically add our custom users and populate database
            //seeder.SeedUsers();

            app.UseCors("AllowSpecificOrigin");
            /* 
                        app.UseCors(builder =>
                               builder.WithOrigins("http://localhost:4200").AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
                 */       // setting cors access , gdzie po stronie angulara będą dostępne zapytania
                          // app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}

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
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            //needed for sharing resourses for angular in front 
            services.AddCors(options =>
                {
                    options.AddPolicy("AllowSpecificOrigin",
                        builder => builder.WithOrigins("http://localhost:4200")
                                           .AllowAnyHeader()
                                           .AllowAnyMethod());
                });

            // addScoped create instance for each Http request
            // but uses the same instance in other cors what is in the same web request 
            // we must specify the interface what we want to use -> IAuthRepository
            // and implementation of this interface -> AuthRepository
            services.AddScoped<IAuthRepository, AuthRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //    app.UseHsts();
            }


            //  app.UseHttpsRedirection();
            app.UseCors("AllowSpecificOrigin");
            /* 
                        app.UseCors(builder =>
                               builder.WithOrigins("http://localhost:4200").AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
                 */       // setting cors access , gdzie po stronie angulara będą dostępne zapytania
                          // app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseMvc();
        }
    }
}

// Copyright (C) 2018 Patrick Hippenmeyer - All Rights Reserved
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Eltisa.Source.Communication;
using static Eltisa.Source.Administration.Configuration;

namespace Eltisa.Source.Administration {

    public class WebHostConfig {

        public WebHostConfig(IWebHostEnvironment env) {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)  {
            // Add framework services.
            services.AddMvc(options => options.EnableEndpointRouting = false);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory) {
            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            //loggerFactory.AddDebug();

            if(WebHost.HasCertificate() ) {
                #if DEBUG
                    var rewriteOptions = new RewriteOptions().AddRedirectToHttps(301, 5001);
                    app.UseRewriter(rewriteOptions);
                #else
                    var rewriteOptions = new RewriteOptions().AddRedirectToHttpsPermanent();
                    app.UseRewriter(rewriteOptions);
                #endif
            }
            
            app.UseExceptionHandler("/Home/Error");

            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("Eltisa.htm");
            app.UseDefaultFiles(options);
            
            app.UseStaticFiles();

            var webSocketOptions = new WebSocketOptions() {
                KeepAliveInterval = TimeSpan.FromSeconds(WebSocketKeepAliveSeconds),
            };            
            app.UseWebSockets(webSocketOptions);

            app.UseMvc(routes => {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.Use(async (context, next) => {
                if(!await HomeSocket.HandleWebSocketRequest(context)) await next();
            });

        }
    }
}

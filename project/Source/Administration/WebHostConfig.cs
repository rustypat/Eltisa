namespace Eltisa.Administration; 

using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Eltisa.Communication;
using static Eltisa.Administration.Configuration;

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
            var rewriteOptions = new RewriteOptions().AddRedirectToHttpsPermanent();
            app.UseRewriter(rewriteOptions);
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

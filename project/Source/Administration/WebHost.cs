namespace Eltisa.Administration; 

using System;
using System.Net;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;

using Eltisa.Communication;
using Eltisa.Tools;
using Eltisa.Server;
using Eltisa.Server.Players;


public static class WebHost {
    private static X509Certificate2 certificate;
    private static IWebHost         host;

    public static void Start() {
        Log.Info("start web host");
        certificate = GetCertificate(Configuration.CertificateName);            
        
        World.StartMaintenanceThread();               

        host = new WebHostBuilder()
            .UseStartup<WebHostConfig>()
            .UseKestrel(options => ConfigureServerOptions(options) )                
            .UseContentRoot(Directory.GetCurrentDirectory())
            .Build();
        host.Run();
    }


    public static void Stop() {
        try {
            Log.Info("start shutdown");
            var chatMessage  = OutMessage.createChatMessage("Admin", "system is going down, by by");
            OutMessageHandler.SendMessageToAll(chatMessage);
            World.StopMaintenanceThread();  
            World.Persist();
            Log.Info("end shutdown");            
        } catch(Exception e) {
            Log.Error(e);
        }
    }

    private static void ConfigureServerOptions(KestrelServerOptions options) {
        #if DEBUG
            options.Listen(IPAddress.Loopback, 5000);  // http:localhost:5000
            if(HasCertificate() ){
                options.Listen(IPAddress.Any, 5001, listenOptions => listenOptions.UseHttps(certificate) );
            }
        #else
            options.Listen(IPAddress.Any, 80);  
            if(HasCertificate() ){
                options.Listen(IPAddress.Any, 443, listenOptions => listenOptions.UseHttps(certificate) );
            }
        #endif
    }


    private static X509Certificate2 GetCertificate(string certificateName) {
        var store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
        store.Open(OpenFlags.ReadOnly);
        var certificates = store.Certificates.Find( X509FindType.FindBySubjectName, certificateName, validOnly: false);
        if (certificates.Count == 0) {
            Log.Warn("certificate " + certificateName + " not found on local machine");
            return null;
        }
        else {
            return certificates[0];
        }
    }

    public static bool HasCertificate() {
        return certificate != null;
    }

}
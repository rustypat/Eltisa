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
            .UseWebRoot(Configuration.WwwDirectory)
            .UseContentRoot(Directory.GetCurrentDirectory())
            .Build();
        host.Run();
    }


    public static void Stop() {
        try {
            Log.Info("start shutdown");
            OutMessageHandler.SendChatMessageToAll("Admin", "system is going down, by by");
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
                options.Listen(IPAddress.Loopback, 5001, listenOptions => listenOptions.UseHttps(certificate) );
            }
        #else
            options.Listen(IPAddress.Any, 80);  
            if(HasCertificate() ){
                options.Listen(IPAddress.Any, 443, listenOptions => listenOptions.UseHttps(certificate) );
            }
        #endif
    }


    private static X509Certificate2 GetCertificate(string certificateName) {
        using var storeCU = new X509Store(StoreName.My, StoreLocation.CurrentUser);
        storeCU.Open(OpenFlags.ReadOnly);
        var certificates = storeCU.Certificates.Find( X509FindType.FindBySubjectName, certificateName, validOnly: false);
        if (certificates.Count > 0) return certificates[0];

        using var storeLM = new X509Store(StoreName.CertificateAuthority, StoreLocation.LocalMachine);
        storeLM.Open(OpenFlags.ReadOnly);
        certificates = storeLM.Certificates.Find( X509FindType.FindBySubjectName, certificateName, validOnly: false);
        if (certificates.Count > 0) return certificates[0];

        Log.Warn("certificate " + certificateName + " not found on local machine");
        return null;
    }

    public static bool HasCertificate() {
        return certificate != null;
    }

}
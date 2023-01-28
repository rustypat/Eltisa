namespace Eltisa.Communication; 

using System;
using System.Threading.Tasks;
using System.Net.WebSockets;
using System.Threading;
using System.Security.Authentication;
using Microsoft.AspNetCore.Http;
using Eltisa.Models;
using Eltisa.Server.Players;
using Eltisa.Tools;
using static System.Diagnostics.Debug;
using static Eltisa.Administration.Configuration;


public class HomeSocket {
    
    private WebSocket         webSocket;
    private Actor             actor;
    private SemaphoreSlim     sendSemaphore  = new SemaphoreSlim(1);


    ///////////////////////////////////////////////////////////////////////////////////////////
    // creation
    ///////////////////////////////////////////////////////////////////////////////////////////


    public static async Task<bool> HandleWebSocketRequest(HttpContext context) {
        if (!context.WebSockets.IsWebSocketRequest)  return false;
        if (context.Request.Path != "/ws")           return false;

        var  socket     = await OpenSocket(context);  
        await socket?.ListenToSocket();
        await socket?.CloseSocket();
        return true;
    }


    private static async Task<HomeSocket> OpenSocket(HttpContext context) {
        HomeSocket homeSocket = new HomeSocket();
        homeSocket.webSocket = await context.WebSockets.AcceptWebSocketAsync();            

        // wait for connection
        for(int i=0; i < 10; i++) {
            if(homeSocket.webSocket.State == WebSocketState.Connecting) {
                await Task.Delay(100);
            }
        }

        if(homeSocket.webSocket.State != WebSocketState.Open) {
            Log.Error("WebSocket: could not connect");
            return null;
        }

        return homeSocket;            
    }


    public void SetActor(Actor actor) {
        Assert(this.actor == null && actor != null);
        this.actor = actor;
    }


    public Actor GetActor() {
        return actor;
    }


    public async Task CloseSocket() {
        try {                
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "good by", CancellationToken.None);
        }catch(Exception e) {
            if(!IsClientClosedWebsocketException(e)) Log.Error(e);
        }
        if(actor != null) {
            ActorStore.RemoveActor(actor);
            var actorMessage = OutMessage.createActorLogoutMessage(actor);
            OutMessageHandler.SendMessageToAll(actorMessage, actor);                            
            Log.Info(actor.Name + " logged out");
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // incomming communication
    ///////////////////////////////////////////////////////////////////////////////////////////


    public async Task ListenToSocket() {

        var inBuffer = new byte[WebSocketBufferSize];
        while (true) {
            try {
                // read full message
                WebSocketReceiveResult inResult;
                int                    inCount  = 0;
                do {
                    var arraySegment = new ArraySegment<byte>(inBuffer, inCount, WebSocketBufferSize - inCount);
                    inResult = await webSocket.ReceiveAsync(arraySegment, CancellationToken.None); 
                    inCount  += inResult.Count;
                    Assert(inCount < WebSocketBufferSize);
                    if(inCount >= WebSocketBufferSize) throw new Exception("websocket inBuffer overflow");
                }while(!inResult.EndOfMessage);

                // check for close
                if(inResult.CloseStatus.HasValue) {
                    return;
                }
                if(webSocket.State != WebSocketState.Open && webSocket.State != WebSocketState.Connecting ) {
                    return;
                }
                
                // handle message
                InMessageHandler.HandleSocketMessage(this, inBuffer);

            }catch(AuthenticationException) {
                return;
            }catch(Exception e) {
                if(!IsClientClosedWebsocketException(e)) Log.Error(e);
                return;
            }
        }
    }


    private static bool IsClientClosedWebsocketException(Exception e) {
        return "The remote party closed the WebSocket connection without completing the close handshake.".Equals(e.Message);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    // outgoing communication
    ///////////////////////////////////////////////////////////////////////////////////////////


    public async void SendMessageAsync(byte[] message) {
        try {
            await sendSemaphore.WaitAsync();
            await webSocket.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Binary, true, CancellationToken.None);
        } 
        catch(Exception e) {
            Log.Error(e);
        }
        finally {
            sendSemaphore.Release();
        }
    }

}
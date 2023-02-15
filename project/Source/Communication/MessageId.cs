namespace Eltisa.Communication;


public enum MessageId {
    LoginRequest                  = 10,
    LoginResponse                 = 11,

    ListActorsRequest             = 20,
    ListActorsResponse            = 21,
    MoveActor                     = 22,
    ActorMoved                    = 23,
    ActorJoined                   = 25,
    ActorLeft                     = 27,

    GetChunksRequest              = 30,
    GetChunksResponse             = 31,
    AddBlock                      = 32,
    RemoveBlock                   = 34,
    ChangeBlock                   = 36,
    SwitchBlock                   = 38,
    BlocksChangedNotification     = 39,

    ChatMessageRequest            = 40,
    ChatMessageResponse           = 41,
    VideoChatMessageRequest       = 42,
    VideoChatMessageResponse      = 43,

    CreateResourceRequest         = 50,
    ReadResourceRequest           = 52,
    WriteResourceRequest          = 54,
    UpdateResourceRequest         = 56,
    DeleteResourceRequest         = 58,        

    CreateResourceResponse        = 51,
    ReadResourceResponse          = 53,
    WriteResourceResponse         = 55,
    UpdateResourceResponse        = 57,
    DeleteResourceResponse        = 59,    
}



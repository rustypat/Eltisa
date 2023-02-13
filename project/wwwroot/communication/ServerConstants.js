'use strict';


// server response target, where to send the response of a request to
const ST_Any                          = 1000;
const ST_Edit                         = 1001;
const ST_View                         = 1002;
const ST_Info                         = 1003;
const ST_Act                          = 1004;


// Server Responses
const SR_Ok                            = 0;
const SR_NotAllowed                    = 1;
const SR_ResourceDoesNotExist          = 2;
const SR_ResourceAlreadyExists         = 3;
const SR_PasswordInvalid               = 4;


// Server Messages
// straight: outgoing, odd: incomming
const SM_LoginRequest                  = 10;
const SM_LoginResponse                 = 11;

const SM_MoveActor                     = 20;
const SM_ActorChanged                  = 21;
const SM_ListActorsRequest             = 22;
const SM_ListActorsResponse            = 23;

const SM_GetChunksRequest              = 30;
const SM_GetChunksResponse             = 31;
const SM_AddBlock                      = 32;
const SM_RemoveBlock                   = 34;
const SM_ChangeBlock                   = 36;
const SM_SwitchBlock                   = 38;
const SM_BlocksChangedNotification     = 39;

const SM_ChatMessageRequest            = 40;
const SM_ChatMessageResponse           = 41;
const SM_VideoChatMessageRequest       = 42;
const SM_VideoChatMessageResponse      = 43;

const SM_CreateResourceRequest         = 50;
const SM_ReadResourceRequest           = 52;
const SM_WriteResourceRequest          = 54;
const SM_UpdateResourceRequest         = 56;
const SM_DeleteResourceRequest         = 58;        

const SM_CreateResourceResponse        = 51;
const SM_ReadResourceResponse          = 53;
const SM_WriteResourceResponse         = 55;
const SM_UpdateResourceResponse        = 57;
const SM_DeleteResourceResponse        = 59;    

const SM_Max                           = 60;


// Server Message Tag
const SMT_EndTag                       = 666999;




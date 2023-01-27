namespace Eltisa.Models; 

using System;



public readonly record struct ResourceResult( ResourceResultType Result, Resource Resource );


public enum ResourceResultType {
    Ok,
    NotAllowed,
    ResourceDoesNotExist,
    ResourceAlreadyExists,
    PasswordInvalid,
}


[Flags]
public enum AccessRights : short {
    NoChange  =  -1,
    Everybody =  0b_0000_111_111_111_111
}


public class Resource {
    
    public AccessRights           AccessRights   {  get;  private set; }
    public int                    BlockType      {  get;  private set; }
    public int                    OwnerId        {  get;  private set; }
    public string                 Password       {  get;  private set; }
    public byte[]                 Data           {  get;  private set; }
    public bool                   Modified       {  get;  internal set; }
    public DateTime               LastUsed       {  get;  private set; }


    public Resource(int blockType, int ownerId, string password, byte[] data) {
        AccessRights    = AccessRights.Everybody;
        BlockType       = blockType;
        OwnerId         = ownerId;
        Password        = password;
        Data            = data;
        Modified         = false;
        LastUsed        = DateTime.Now;
    }


    public void UpdatePassword(string newPassword) {
        if(newPassword != null) {
            Password = newPassword;
            Modified = true;
            LastUsed = DateTime.Now;
        }
    }


    public void UpdateData(byte[] newData) {
        if(newData != null) {
            Data     = newData;
            Modified = true;
            LastUsed = DateTime.Now;
        }
    }


    public void Touch() {
        LastUsed = DateTime.Now;
    } 


    public bool UsedAfter(DateTime dateTime) { return LastUsed.CompareTo(dateTime) > 0; }
}




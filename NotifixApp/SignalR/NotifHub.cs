using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;

namespace NotifixApp
{
    public class NotifHub : Hub
    {
        public void Send(object notif)
        {
            List<string> excluded = new List<string>();
            excluded.Add(Context.ConnectionId);
            Clients.AllExcept(excluded).InvokeAsync("notifSignalAdd", notif);
        }
    }
}
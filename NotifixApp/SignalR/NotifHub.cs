using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;

namespace NotifixApp
{
    public class NotifHub : Hub
    {
        public void Send(object notif)
        {
            Clients.All.InvokeAsync("notifSignalAdd", notif);
        }
    }
}
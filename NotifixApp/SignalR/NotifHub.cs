using Microsoft.AspNetCore.SignalR;

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
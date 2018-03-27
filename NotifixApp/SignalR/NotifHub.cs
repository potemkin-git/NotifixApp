using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace SignalRNotifier
{
    public class NotifHub : Hub
    {
        public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            Clients.All.addNewMessageToPage(name, message);
        }
    }
}
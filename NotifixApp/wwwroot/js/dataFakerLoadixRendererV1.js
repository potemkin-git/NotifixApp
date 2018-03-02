let notifs = [];


notifs.push(new Notification(null, 42, 'jam', 'Hey! Take a bike next time bro!', '10011985', '1212', '43.581941', '3.877816', 12, 3));
notifs.push(new Notification(null, null, 'accident', 'Warning the car is crashed be very careful please!', '06111992', '1313', '43.580380', '3.875980', 2, 5));
notifs.push(new Notification(null, 42, 'police', '22 vla les keufs!!!', '25120000', '1414', '43.580994', '3.879848', 6, 4));
notifs.push(new Notification(null, 42, 'jam', 'Hey! Take a bike next time bro!', '11092001', '1515', '43.582410', '3.886065', 5, 15));
notifs.push(new Notification(null, null, 'accident', 'Achtung! das otomobïl is vertungen!', '14071789', '1616', '43.581770', '3.875681', 24, 20));


notifs.forEach(function(notif) {
    addMarker(notif);
});


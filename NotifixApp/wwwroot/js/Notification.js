class Notification {
    constructor(id, userId, type, desc, date, time, lat, long, nbConf, nbDeny) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.desc = desc;
        this.date = date;
        this.time = time;
        this.coord = new google.maps.LatLng(lat,long);
        this.nbConf = nbConf == null? 0 : nbConf;
        this.nbDeny = nbDeny == null? 0 : nbDeny;

    }
}


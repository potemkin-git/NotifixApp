class Notification {
    constructor(id, userToken, type, desc, date, time, lat, lng, nbConf, nbDeny) {
        this.id = id;
        this.userToken = userToken;
        this.type = type;
        this.desc = desc;
        this.date = date;
        this.time = time;
        this.lat = lat;
        this.lng = lng;
        this.nbConf = nbConf == null? 0 : nbConf;
        this.nbDeny = nbDeny == null? 0 : nbDeny;
    }
}


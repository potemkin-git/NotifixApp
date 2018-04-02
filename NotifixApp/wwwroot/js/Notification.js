class Notification {
    constructor(id, userToken, type, desc, expDate, lat, lng, nbConf, nbDeny) {
        this.id = id;
        this.userToken = userToken;
        this.type = type;
        this.desc = desc;
        this.expDate = expDate,
        this.lat = lat;
        this.lng = lng;
        this.nbConf = nbConf == null? 0 : nbConf;
        this.nbDeny = nbDeny == null? 0 : nbDeny;
    }
}


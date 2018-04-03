var map, infoOpened, infoClosed = true;
var jamLayer, accidentLayer, policeLayer, masterLayer = [];
var login = getCookie('login');
var hash = getCookie('hash');
var asAnonymous = false;
if (login == '' || typeof login == 'undefined') {
    asAnonymous = true;
    $('#settingsBtn, #logOutBtn').parent().hide();
    $("#cookieDisclaimer").show();
} else {
    $("#settingsBtn").append(login);
    $('#loginBtn').parent().hide();

}
Materialize.toast("Connected as: " + (asAnonymous ? "Anonymous" : login), 2000, "rounded");


// SignalR init
var connection = new signalR.HubConnection("/notifixhub");
connection.on('notifSignalAdd', (notif) => {
    createMarker(notif, false);
});
connection.start();

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        streetViewControl : false,
        fullscreenControl : false
    });

    initSearchBox(map);
    initLayers();
    loadListeners();
    locateMe();
}

function locateMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function (err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        });
    } else {
        console.log("Browser Geolocation unavailable");
    }
}

function showPosition(position) {
    let myLat = position.coords.latitude;
    let myLong = position.coords.longitude;
    var avatar;
    getAvatar(login).done(function (result) {
        if (result == "none") {
            var icon = {
                url: '../images/here.png', // url
            };
        } else {
            var icon = {
                url: result.slice(3), // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
            };
        }
        map.setCenter({ lat: myLat, lng: myLong });
        new google.maps.Marker({
            map: map,
            icon: icon,
            position: new google.maps.LatLng(myLat, myLong),
            animation: google.maps.Animation.BOUNCE
        });
    });
}

function initSearchBox(map) {
    let input = document.getElementById('searchInput');
    let searchBox = new google.maps.places.SearchBox(input);
    let inputModal = document.getElementById('searchInputModal');
    let searchBoxModal = new google.maps.places.SearchBox(inputModal);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
        let places = searchBox.getPlaces();

        if (places.length) {
            // Adding marker on current position
            new google.maps.Marker({
                map: map,
                title: places[0].name,
                animation: google.maps.Animation.BOUNCE,
                position: places[0].geometry.location});

            map.panTo(places[0].geometry.location);
            map.setZoom(20);
        }
    });

    searchBoxModal.addListener('places_changed', function() {
        let places = searchBoxModal.getPlaces();
        let $coordsData = $('#coordsData');
        if (places.length) {
            $coordsData.attr("data-lat", places[0].geometry.location.lat());
            $coordsData.attr("data-long", places[0].geometry.location.lng());
        }
    });
}

function initLayers() {
    window.jamLayer = new google.maps.Data();
    window.accidentLayer = new google.maps.Data();
    window.policeLayer = new google.maps.Data();
    window.masterLayer = [jamLayer, accidentLayer, policeLayer];

    masterLayer.forEach(function (layer) {

        layer.setMap(map);

        layer.setStyle(function(feature) {
            return {
                icon: {
                    url: "../images/"+feature.getProperty('notif').type+".png",
                    scaledSize: new google.maps.Size(30, 30)
                },
                cursor: 'pointer'
            }
        });

        layer.addListener('click', function (elem) {
            let infowindow = elem.feature.getProperty('infoWindow');
            let infowindowShort = elem.feature.getProperty('infoWindowShort');
            let notif = elem.feature.getProperty('notif');
            
            if (typeof (window.infoOpened) != 'undefined')
            {
                infoOpened.close();
            }

            infowindow.open(map);
            infowindowShort.close();
            infoOpened = infowindow;
            infoClosed = false;

            google.maps.event.addListener(infowindow, 'domready', function () {
                $('#thumbUp, #thumbDown').off().click(function () {

                    if (asAnonymous) {
                        var $toastContent = $('<span>You need to be logged in to perform this action!</span>').add($('<a class="btn-flat toast-action" href="/login">Create my account</a>'));
                        Materialize.toast($toastContent, 10000);
                        return;
                    }

                    let voteValue, indexToReplace, newInfoWindowShort;
                    let iwsContent = infowindowShort.getContent();
                    if ($(this).attr('id') == "thumbUp") {
                        voteValue = 1;
                        indexToReplace = iwsContent.indexOf("Approved by ") + "Approved by ".length;
                        let firstPart = iwsContent.substring(0, indexToReplace);
                        let lastPart = iwsContent.substring(indexToReplace + notif.nbConf.toString().length, iwsContent.length);
                        notif.nbConf++;
                        newInfoWindowShort = firstPart + notif.nbConf +" "+ lastPart;
                    } else {
                        voteValue = -1;
                        let indexAfterRep = (indexToReplace + notif.nbDeny.toString().length) + 1;
                        indexToReplace = iwsContent.indexOf("Disapproved by ") + "Disapproved by ".length;
                        let firstPart = iwsContent.substring(0, indexToReplace);
                        let lastPart = iwsContent.substring(indexToReplace + notif.nbDeny.toString().length, iwsContent.length);
                        notif.nbDeny++;
                        newInfoWindowShort = firstPart + notif.nbDeny + " " + lastPart;
                    }

                    infowindowShort.setContent(newInfoWindowShort);

                    notificationVote(notif.id, voteValue).done(function (res) {
                        Materialize.toast("Thanks for voting!", 2000, "rounded");

                    }).fail(function (res) {
                        console.log(res.responseText);
                    });
                    $(this).parent().hide();
                });
            });

            google.maps.event.addListener(map, 'click', function() {
                infowindow.close();
                infoClosed = true;

            });

            google.maps.event.addListener(infowindow, 'closeclick', function () {
                infoClosed = true;
            });
        });

        layer.addListener('mouseover', function (elem) {
            if (!infoClosed) return;
            let infowindowShort = elem.feature.getProperty('infoWindowShort');
            infowindowShort.open(map);
        });

        layer.addListener('mouseout', function (elem) {
            let infowindowShort = elem.feature.getProperty('infoWindowShort');
            infowindowShort.close();
        });

    })
}

initMap();

getAllNotifications().done(function (data) {
    for (let key in data) {
        let item = data[key];
        let notif = new Notification(item.id, item.userToken, item.type, item.desc, item.expDate, item.lat, item.lng, item.nbConf, item.nbDeny);
        addMarker(notif, true);
    }
});



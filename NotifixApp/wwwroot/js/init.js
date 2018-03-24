var map, infoOpened, infoClosed = true;
var jamLayer, accidentLayer, policeLayer, masterLayer = [];
var login = getCookie('login');
var hash = getCookie('hash');
console.log('Cookies=');
console.log(login);
console.log(hash);
Materialize.toast("Connected as: " + (login.length > 0 ? login : "Anonymous"), 2000, "rounded");
$("#logOutBtn").append(login == '' ? 'Anonymous' : login);

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
    map.setCenter({lat: myLat, lng: myLong});
    new google.maps.Marker({
        map: map,
        icon: '../images/here.png',
        position: new google.maps.LatLng(myLat,myLong),
        animation: google.maps.Animation.BOUNCE
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
                    scaledSize: new google.maps.Size(40, 40)
                },
                cursor: 'pointer'
            }
        });

        layer.addListener('click', function (elem) {
            let infowindow = elem.feature.getProperty('infoWindow');
            let infowindowShort = elem.feature.getProperty('infoWindowShort');
            let notif = elem.feature.getProperty('notif');

            if (typeof (window.infoopened) != 'undefined')
            {
                infoOpened.close();
            }

            infowindow.open(map);
            map.setZoom(15);
            infowindowShort.close();
            infoOpened = infowindow;
            infoClosed = false;

            google.maps.event.addListener(infowindow, 'domready', function () {
                $('#thumbUp').click(function () {
                    notif.nbConf++;
                });
                $('#thumbDown').click(function () {
                    notif.nbDeny++;
                });

                // Button from infoWindow that opens the notification edition modal window
                $('#editNotif').click(function () {
                    clearForm();
                    $('#optionalSearchInput').hide();
                    $('.createMode').hide();
                    $('.editMode').show();
                    $('#addNotif').css("height", "55%").modal('open');
                    $('#descEvent').text(notif.desc);
                    $('#'+notif.type+'.typeSelection').addClass('active');
                    $('#resultType').val(notif.type);
                    $('#dateInput').val(notif.date);
                    $('#timeInput').val(notif.time);
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
        let notif = new Notification(null, item.userToken, item.type, item.desc, item.date, item.time, item.lat, item.lng, item.nbConf, item.nbDeny);
        addMarker(notif, true);
    }
});



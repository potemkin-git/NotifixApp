var map, infoopened, infoclosed = true, userId = 42;
var jamLayer, accidentLayer, policeLayer, masterLayer = [];

var cookieSub = document.cookie.substring(document.cookie.indexOf("login"));
var login = cookieSub.substring(cookieSub.indexOf("=") + 1, cookieSub.indexOf(";"));
var hashSub = document.cookie.substring(document.cookie.indexOf("hash"));
var hash = hashSub.substring(hashSub.indexOf("=") + 1);
console.log('init');
console.log(login);
console.log(hash);

$("#logOutBtn").text(login == '' ? 'Anonymous' : login);


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

            if (typeof( window.infoopened ) != 'undefined') infoopened.close();
            infowindow.open(map);
            infowindowShort.close();
            infoopened = infowindow;
            infoclosed = false;

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
                infoclosed = true;

            });

            google.maps.event.addListener(infowindow, 'closeclick', function () {
                infoclosed = true;
            });
        });

        layer.addListener('mouseover', function (elem) {
            if (!infoclosed) return;
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



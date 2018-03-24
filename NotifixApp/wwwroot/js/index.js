$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: true // Close upon selecting a date,
    });

    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: true, // automatic close timepicker
        //ampmclickable: true, // make AM PM clickable
    });
});

function getFormInfo() {
    let infos = [];
    infos.type = $('#resultType').val();
    infos.lat = $('#latForm').val();
    infos.lng = $('#lngForm').val();
    infos.date = $('#dateInput').val();
    infos.time = $('#timeInput').val();
    infos.desc = $('#descEvent').val();
    $('#descEvent').trigger('autoresize');
    let currLat = $('#coordsData').attr('data-lat');
    let currLong = $('#coordsData').attr('data-long');

    if (infos.lat != "" && infos.lng != ""){
        if (!isNaN(parseFloat(infos.lat))
            && !isNaN(parseFloat(infos.lng))
            && parseFloat(infos.lat) >= -90
            && parseFloat(infos.lat) <= 90
            && parseFloat(infos.lng) >= -180
            && parseFloat(infos.lng) <= 180) {
            currLat = parseFloat(infos.lat);
            currLong = parseFloat(infos.lng);
        }
    }

    return new Notification(null, getCookie('hash'), infos.type, infos.desc, infos.date, infos.time, currLat, currLong, 0, 0);
}

function clearForm() {
    $('#formNotif')[0].reset();
    $('#descEvent').empty();
    $('.typeSelection').removeClass('active');
}

function addMarker(notif, fromDb) {

    if (fromDb) {
        createMarker(notif);
    } else
    {
        saveNotification(notif).done(function (result) {
            if (result == 0) {
                Materialize.toast("Saving an event is forbidden as anonymous!", 2000, "rounded");
            } else {
                createMarker(notif);
            }
        }).fail(function (result) {
            console.log(result.responseText)
            Materialize.toast("Service is not callable, please retry later.", 2000, "rounded");
        });    
    }    
}

function createMarker(notif) {
    let editable = (notif.userToken == getCookie('hash')) ? '<a id="editNotif" class="btn-floating"><i class="material-icons">edit</i></a>' : "";

    let menu = '<a id="thumbUp" class="btn-floating green"><i class="material-icons">thumb_up</i></a>' +
        '<a id="thumbDown" class="btn-floating red"><i class="material-icons">thumb_down</i></a>' +
        editable;

    let infowindowData = "<div class='infowindow'>" +
        "<p>Event type: " + notif.type + "</p>" +
        "<p>" + notif.desc + "</p>" +
        "<p>Date: " + notif.date + "  &  Time: " + notif.time + "</p>" +
        "<p id='iw-menu'>" + menu + "</p>" +
        "</div>";

    let infowindowShortData = "<div class='infowindowShort'>" +
        "<p>Type: " + notif.type + "</p>" +
        "<p>Description: " + notif.desc + "</p>" +
        "<p>Approved by " + notif.nbConf + " people</p>" +
        "<p>Disapproved by " + notif.nbDeny + " people</p>" +
        "</div>";

    let infowindow = new google.maps.InfoWindow({ pixelOffset: new google.maps.Size(0, -30), maxWidth: 350 });
    infowindow.setContent(infowindowData);
    infowindow.setPosition(notif.coord);

    let infowindowShort = new google.maps.InfoWindow({ pixelOffset: new google.maps.Size(0, -30) });
    infowindowShort.setContent(infowindowShortData);
    infowindowShort.setPosition(notif.coord);

    let marker = new google.maps.Data.Feature({
        geometry: { lat: parseFloat(notif.lat), lng: parseFloat(notif.lng) },
        properties: {
            infoWindow: infowindow,
            infoWindowShort: infowindowShort,
            notif: notif
        }
    });

    switch (notif.type) {
        case 'jam':
            jamLayer.add(marker);
            break;
        case 'accident':
            accidentLayer.add(marker);
            break;
        case 'police':
            policeLayer.add(marker);
            break;
    }

    map.panTo({ lat: parseFloat(notif.lat), lng: parseFloat(notif.lng) });
    map.setZoom(17);
}

function unsetCookie() {
    document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "hash=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    Materialize.toast("Disconnecting...", 2000, "rounded", function () {
        window.location.reload();
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
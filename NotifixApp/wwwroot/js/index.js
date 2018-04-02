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
        ampmclickable: true, // make AM PM clickable
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

    if (infos.lat != "" && infos.lng != "") {
        if (!isNaN(parseFloat(infos.lat)) && !isNaN(parseFloat(infos.lng))
            && parseFloat(infos.lat) >= -90 && parseFloat(infos.lat) <= 90
            && parseFloat(infos.lng) >= -180 && parseFloat(infos.lng) <= 180) {
            currLat = parseFloat(infos.lat);
            currLong = parseFloat(infos.lng);
        } else {
            currLat = "";
            currLong = "";
        }
    }  

    let isValidForm = true;
    // Mandatory values
    if (infos.type == "") {
        Materialize.toast("Please select an event type", 3000, "rounded");
        isValidForm = false;
    }
    if (currLat == "" || currLong == "") {
        Materialize.toast("Invalid coordinates (latitude/longitude)", 3000, "rounded");
        isValidForm = false;
    }
    // Optional values: date & time => if both empty, will be set to current Date + 10 days
    let expDate;
    if (infos.date == "") {
        expDate = new Date().addDays(10);
    } else {
        expDate = new Date(infos.date + " " + infos.time == "" ? "00:00" : infos.time);
    }
    return isValidForm ? new Notification(null, getCookie('hash'), infos.type, infos.desc, expDate, currLat, currLong, 0, 0) : null;
}

function clearForm() {
    $('#formNotif')[0].reset();
    $('#descEvent').empty();
    $('.typeSelection').removeClass('active');
}

function addMarker(notif, fromDb) {
    if (fromDb) {
        createMarker(notif, fromDb);
    } else
    {
       saveNotification(notif).done(function (result) {
            if (result == 0) {
                Materialize.toast("Saving an event is forbidden as anonymous!", 2000, "rounded");
            } else {
                connection.invoke('send', notif); // SignalR call
                Materialize.toast("Successfuly saved!", 2000, "rounded", function () {
                    window.location.reload();
                });
            }
        }).fail(function (result) {
            console.log(result.responseText)
            Materialize.toast("Service is not callable, please retry later.", 2000, "rounded");
        });    
    }    
}

function createMarker(notif, fromDb) {
    let ownedByCurrentUser = (notif.userToken == getCookie('hash'));

    let editable = ownedByCurrentUser ? '<a id="editNotif" class="btn-floating"><i class="material-icons">edit</i></a>' : '';
    let voteBtns = !ownedByCurrentUser ? '<a id="thumbUp" class="btn-floating green"><i class="material-icons">thumb_up</i></a>' +
        '<a id="thumbDown" class="btn-floating red"><i class="material-icons">thumb_down</i></a>' : '';

    let infowindowData = "<div class='infowindow'>" +
        "<p>Event type: " + notif.type + "</p>" +
        "<p>" + notif.desc + "</p>" +
        "<p>Date: " + notif.date + "  &  Time: " + notif.time + "</p>" +
        "<p id='iw-menu'>" + voteBtns + editable + "</p>" +
        "</div>";

    let infowindowShortData = "<div class='infowindowShort'>" +
        "<p>Type: " + notif.type + "</p>" +
        "<p>Description: " + notif.desc + "</p>" +
        "<p>Approved by " + notif.nbConf + " people</p>" +
        "<p>Disapproved by " + notif.nbDeny + " people</p>" +
        "</div>";

    let infowindow = new google.maps.InfoWindow({ pixelOffset: new google.maps.Size(0, -30), maxWidth: 350 });
    infowindow.setContent(infowindowData);
    infowindow.setPosition({ lat: parseFloat(notif.lat), lng: parseFloat(notif.lng) });

    let infowindowShort = new google.maps.InfoWindow({ pixelOffset: new google.maps.Size(0, -30) });
    infowindowShort.setContent(infowindowShortData);
    infowindowShort.setPosition({ lat: parseFloat(notif.lat), lng: parseFloat(notif.lng) });

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
}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

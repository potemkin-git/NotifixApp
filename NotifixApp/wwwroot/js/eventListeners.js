function loadListeners() {

    // Notification creation modal window: sets an active Type display and stores the chosen id
    $('.typeSelection').click(function () {
        $('.typeSelection').removeClass('active');
        $('.typeSelection').parent().css({"color": "initial", "font-weight": "initial"});
        let id = $(this).attr('id');
        $('#resultType').val(id);
        $(this).addClass('active');
        $(this).parent().css({"color": "#00B4D4", "font-weight": "bold"});
    });

    // Button that opens the notification creation modal window(additionnal fields + custom size)
    $('#addEvent').click(function () {
        clearForm();
        $('.createMode').show();
        $('.editMode').hide();
        $('#optionalSearchInput').show();
        if ($('#toggleFilter').hasClass('active')) {
            $('#toggleFilterBtn').trigger('click');
        }
        $('#addNotif').css("height", "80%").modal('open');
    });

    // Switch between "place" or "lat+long coordinates" fields while adding a notification (from addEvent button)
    $('#coordChoice').find('input[type=radio]').click(function () {
        let $optionalAddressInput = $('#optionalAddressInput');
        let $optionnalLatLngInput = $('#optionnalLatLngInput');
        switch ($(this).attr('id')) {
            case 'address':
                $optionalAddressInput.show();
                $optionnalLatLngInput.hide();
                break;
            case 'gps':
                $optionnalLatLngInput.show();
                $optionalAddressInput.hide();
                break
        }
    });

    // Opens from map click the notification creation modal window (location is automatically set + reduced size)
    map.addListener('dblclick', function (event) {
        clearForm();
        $('.createMode').show();
        $('.editMode').hide();
        $('#optionalSearchInput').hide();
        $('#latLngInput').hide();
        let latLng = event.latLng;
        let $coordsData = $('#coordsData');
        $coordsData.attr("data-lat", ''+latLng.lat());
        $coordsData.attr("data-long", ''+latLng.lng());
        this.panTo(latLng);
        if ($('#toggleFilter').hasClass('active')) {
            $('#toggleFilterBtn').trigger('click');
        }
        $('#addNotif').css("height", "55%").modal('open');
    });

// Save button fetch form information & adds marker
    $('#saveModal').click(function () {
        if (!asAnonymous) {
            let notification = getFormInfo();
            if (notification !== null ) {
                addMarker(notification, false);
            } else {
                var $toastContent1 = $('<span>Error : all fields required </span>');
                Materialize.toast($toastContent1, 10000);
                return;

            }
        } else {
            var $toastContent = $('<span>You need to be logged in to perform this action!</span>').add($('<a class="btn-flat toast-action" href="/login">Create my account</a>'));
            Materialize.toast($toastContent, 10000);
            return;
        }
    });

// Filter sidebar Pull/Push
    $('#toggleFilterBtn').click(function () {
        let $toggleFilter = $('#toggleFilter');
        let $filterCheckbox = $('#filterCheckbox');

        if ($toggleFilter.hasClass('active')) {
            $toggleFilter.animate({width: "10px"}, 600);
            $toggleFilter.removeClass('active');
            $filterCheckbox.delay(150).queue(function (next) {
                $(this).hide();
                next();
            });
            // $filterCheckbox.hide();
            $(this).css({transform: "rotate(0deg)", right: "-15px"});
        } else {
            $toggleFilter.animate({width: "30vh"}, 600);
            $toggleFilter.addClass('active');
            $filterCheckbox.delay(200).queue(function (next) {
                $(this).css("display", "flex");
                next();
            });
            $(this).css({"transform":"rotate(180deg)", "right":"-1px"});
        }
    });

// Filter actions
    $('#jamFilter').click(function () {
        if ($(this).is(':checked')) {
            jamLayer.setMap(map);
        } else {
            jamLayer.setMap(null);
        }
    });

    $('#accidentFilter').click(function () {
        if ($(this).is(':checked')) {
            accidentLayer.setMap(map);
        } else {
            accidentLayer.setMap(null);
        }
    });

    $('#policeFilter').click(function () {
        if ($(this).is(':checked')) {
            policeLayer.setMap(map);
        } else {
            policeLayer.setMap(null);
        }
    });

}




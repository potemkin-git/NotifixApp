$("#password form").submit(function (event) {
    const mail = $("#password #mail").val();
    if (mail != "") {
        resetPassword(mail).done(function(result) {
//            result = 400 OK    401 FAIL
        });

    } else {
            $("#passwordErrorMsg").text("You must enter mail").show();
    }
});

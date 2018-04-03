$("#password form").submit(function (event) {
    event.preventDefault();
    const mail = $("#mail").val();
    if (mail != "") {
        resetPassword(mail).done(function(result) {
            switch (result) {
                case "400":
                    $("#passwordErrorMsg").text("Your new pawssword has been sent to your email address!").css({color:'lightgreen'}).show();
                    break
                case "401":
                    $("#passwordErrorMsg").text("The provided email has no account!").show();
                    break
            }
        });
    } else {
            $("#passwordErrorMsg").text("You must enter your email").show();
    }
});

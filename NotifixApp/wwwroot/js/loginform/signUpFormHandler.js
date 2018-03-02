function blink_text() {
    $(".errMsg").fadeOut(300, function () {
        $('.errMsg').fadeIn(300);
    });
}

setInterval(blink_text, 3000);

$("#signup form").submit(function (event) {
    let fName = $("#signup form #fName").val();
    let lName = $("#signup form #lName").val();
    let login = $("#signup form #loginNew").val();
    let email = $("#signup form #email").val();
    let pwd = $("#signup form #password").val();
    let city = $("#signup form #city").val();
    let address = $("#signup form #address").val();
    let avatarSrc = $('#avaThumb').attr('src');

    let msgError = "";
    let validInputs = false;
    let allowed = false;

    if (fName == "" || lName == "" || login == "" || email == "" || pwd == "" || city == "" || address == "" || avatarSrc.indexOf('miss.jpg') != -1)
        msgError = "All fields are required";
    else if (login.length < 5)
        msgError = "Login must have 5 characters or more";
    else if (!validateEmail(email))
        msgError = "Invalid email address";
    else if (pwd.length < 8)
        msgError = "Password must have 5 characters or more";
    else validInputs = true;

    if (!validInputs || msgError != "") {
        $("#signUpErrorMsg").text(msgError).show();
    } else {
        isLoginUsed(login).then(function (result) {
            if (result == "200") {
                $("#signUpErrorMsg").text("Login already used, please choose another").show();
            } else {
                isPasswordUsed(pwd).then(function (result) {
                    if (result != "404") {
                        $("#signUpErrorMsg").text("Login already used, please choose another").show();
                    } else {

                        registerUser(new User(null, fName, lName, login, email, pwd, city, address, avatarSrc)).then(function (result) {
                            if (result == "200") {
                                allowed = true;
                                // @todo set cookie
                            }
                        }).catch(function (err) {
                            console.error('Error:' + err);
                        });
                    }
                }).catch(function (err) {
                    console.error('Error:' + err);
                });


            }
        }).catch(function (err) {
            console.error('Error:' + err);
        });
    }

    if (!allowed) event.preventDefault();
});


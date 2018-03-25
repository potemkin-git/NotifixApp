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
        msgError = "Password must have 8 characters or more";
    else validInputs = true;

    if (!validInputs || msgError != "") {
        $("#signUpErrorMsg").text(msgError).show();
    } else {
        isLoginorEmailUsed(login, email).done(function (resultCheck) {
            console.log(resultCheck);
            if (resultCheck == "403login") {
                $("#signUpErrorMsg").text("Login already used, please choose another").show();
            } else if (resultCheck == "403pwd") {
                $("#signUpErrorMsg").text("Email already used, please choose another").show();
            }
            else if (resultCheck == "200"){
                registerUser(fName, lName, login, email, pwd, city, address, avatarSrc).done(function (resultCreate) {
                    console.log(resultCreate);
                    let code = resultCreate.substr(0, 3);
                    let hash = resultCreate.substr(3);
                    if (code == "200") {
                        allowed = true;
                        $("#signUpErrorMsg").text("").hide();
                        let date = new Date();
                        date.setMonth(date.getMonth() + 1);
                        document.cookie = "login=" + login + "; expires=" + date + "; path=/";
                        document.cookie = "hash=" + hash + "; expires=" + date + "; path=/";
                        window.location.href = '/';
                    } else if (code == "404") {
                        $("#signUpErrorMsg").text("Account creation failed").show();
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


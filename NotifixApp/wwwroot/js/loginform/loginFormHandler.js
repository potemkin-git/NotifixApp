function blink_text() {
    $(".errMsg").fadeOut(300, function () {
        $('.errMsg').fadeIn(300);
    });
}
setInterval(blink_text, 3000);


function loginSubmit() {
    const login = $("#login #loginInput").val();
    const pwd = $("#login #pwdInput").val();
    if (login !== "" && pwd !== "") {
        loginPasswordMatch(login, pwd).done(function (result) {
            console.log(result);
            let code = result.substr(0, 3);
            let hash = result.substr(3);
            if (code == "403") {
                $("#loginErrorMsg").text("Invalid login and/or password").show();
            } else if (code == "200") {
                $("#loginErrorMsg").text("").hide();
                let date = new Date();
                date.setMonth(date.getMonth() + 1);
                document.cookie = "login=" + login + "; expires=" + date + "; path=/";
                document.cookie = "hash=" + hash + "; expires=" + date + "; path=/";
                window.location.href = '/';
            }
        }).fail(function () {
            $("#loginErrorMsg").text("Connexion to server failed").show();
            });
    } else {
        $("#loginErrorMsg").text("Login and password are required to log in !").show();
    }
}


var log = getCookie('login');
var hash = getCookie('hash');


function blink_text() {
    $(".errMsg").fadeOut(300, function () {
        $('.errMsg').fadeIn(300);
    });
}

setInterval(blink_text, 3000);

$(document).ready(function () {
    getUserInfos(log, hash).done(function (result) {
      console.log(result.add);
        $("#fName").val(result.first);
        $("#lName").val(result.last);
        $("#loginNew").val(result.log);
        $("#email").val(result.mail);
        $("#city").val(result.city);
        $("#address").val(result.add);
        $("#avaThumb").val(result.av);
    });
});

$("#settings form").submit(function (event) {
    let fName = $("#settings form #fName").val();
    let lName = $("#settings form #lName").val();
    let login = $("#settings form #loginNew").val();
    let email = $("#settings form #email").val();
    let pwd = $("#settings form #password").val();
    let city = $("#settings form #city").val();
    let address = $("#settings form #address").val();
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
        $("#settingsErrorMsg").text(msgError).show();
    } else {
        //isLoginorEmailUsed(login, email).then(function (resultCheck) {
                updateUser(fName, lName, login, email, pwd, city, address, avatarSrc).then(function (resultCreate) {
                    console.log(resultCreate);
                    let code = resultCreate.substr(0, 3);
                    let hash = resultCreate.substr(3);
                    if (code == "200") {
                        allowed = true;
                        $("#settingsErrorMsg").text("").hide();
                        let date = new Date();
                        date.setMonth(date.getMonth() + 1);
                        document.cookie = "login=" + login + "; expires=" + date + "; path=/";
                        document.cookie = "hash=" + hash + "; expires=" + date + "; path=/";
                        window.location.href = '/';
                    } else if (code == "404") {
                        $("#settingsErrorMsg").text("Update failed").show();
                    }
                }).catch(function (err) {
                    console.error('Error:' + err);
                });
            }
    if (!allowed) event.preventDefault();
});

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


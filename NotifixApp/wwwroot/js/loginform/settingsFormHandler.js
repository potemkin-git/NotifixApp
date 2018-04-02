var log = getCookie('login');
var hash = getCookie('hash');
var verified = false;

$(document).ready(function () {
    getUserInfos(log, hash).done(function (result) {
        if (result == null) {
            Materialize.toast("User not found!", 2000, "rounded", function () {
                window.location.href = '/';
            });
        } else {
            verified = true;
            $("#fName").val(result.firstName);
            $("#lName").val(result.lastName);
            $("#loginNew").val(result.login);
            $("#email").val(result.mail);
            $("#city").val(result.city);
            $("#address").val(result.address);
            $("#avaThumb").attr('src', result.avatar);
        }
        });
});

$("#settings form").submit(function (event) {

    event.preventDefault();

    if (!verified) {
        window.location.href = '/';
        return;
    }

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

    if (fName == "" || lName == "" || login == "" || email == "" || city == "" || address == "" || avatarSrc.indexOf('miss.jpg') != -1)
        msgError = "All fields are required";
    else if (login.length < 5)
        msgError = "Login must have 5 characters or more";
    else if (!validateEmail(email))
        msgError = "Invalid email address";
    else if (pwd != "" && pwd.length < 8)
        msgError = "Password must have 8 characters or more";
    else validInputs = true;

    if (!validInputs || msgError != "") {
        $("#settingsErrorMsg").text(msgError).show();
    } else {
        //isLoginorEmailUsed(login, email).then(function (resultCheck) {
        updateUser(fName, lName, login, email, pwd, city, address, avatarSrc).then(function (resultCreate) {
            console.log(resultCreate);
            if (resultCreate == "200") {
                allowed = true;
                $("#settingsErrorMsg").text("").hide();
                window.location.href = '/';
                    Materialize.toast("Settings updated", 8000);  //TODO  PRIOTITE  POPUP CONNECTED AS ..

            } else if (resultCreate == "404") {
                $("#settingsErrorMsg").text("Update failed").show();
            }
        }).catch(function (err) {
            console.error('Error:' + err);
        });
    }
});

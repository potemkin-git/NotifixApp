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
            $("#loginNew").val(log);
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

    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let pwd = $("#password").val();
    let city = $("#city").val();
    let address = $("#address").val();
    let avatarSrc = $('#avaThumb').attr('src');
    let msgError = "";
    let validInputs = false;

    if (fName == "" || lName == "" || email == "" || city == "" || address == "" || avatarSrc.indexOf('miss.jpg') != -1)
        msgError = "All fields are required";
    else if (!validateEmail(email))
        msgError = "Invalid email address";
    else if (pwd != "" && pwd.length < 8)
        msgError = "Password must have 8 characters or more";
    else validInputs = true;

    if (!validInputs || msgError != "") {
        $("#settingsErrorMsg").text(msgError).show();
    } else {
        isLoginorEmailUsed(log, email).done(function (resultCheck) {
            if (resultCheck == "403login") {
                $("#settingsErrorMsg").text("Login already used, please choose another").show();
            } else if (resultCheck == "403pwd") {
                $("#settingsErrorMsg").text("Email already used, please choose another").show();
            }
            else if (resultCheck == "200") {
                updateUser(fName, lName, log, email, pwd, city, address, avatarSrc).then(function (resultCreate) {
                    if (resultCreate == "200") {
                        $("#settingsErrorMsg").text("").hide();
                        Materialize.toast("Settings updated!", 1000, "rounded", function () {
                            Materialize.toast("Redirecting to application...", 2000, "rounded", function () {
                                window.location.href = '/map';
                            });
                        });
                    } else if (resultCreate == "404") {
                        $("#settingsErrorMsg").text("Update failed").show();
                    }
                }).catch(function (err) {
                    console.error('Error:' + err);
                });
            }
        });
    }
});

function deleteAccount() {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover your account!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deleteUserAccount(log).done(function (result) {
                    if (result == "suppressed") {
                        Materialize.toast("Account being deleted...", 2000, "rounded", function () {
                            unsetCookie('/');
                        });
                    }
                });
            }
        });
}
var baseUrl = "http://localhost:62002/notifix/api/";
// Call to WS checking if login or email exists
function isLoginorEmailUsed(login, password) {
    return $.post(baseUrl + "checkUniqueLoginEmail", "=" + JSON.stringify({ 'login': login, 'email': password }));
}


// Call to WS checking if login matches provided password
function loginPasswordMatch(login, pwd) {
    return $.post( baseUrl+ "checklogin", "="+JSON.stringify({'login': login , 'password': pwd}));
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function registerUser(fName, lName, login, email, pwd, city, address, avatarSrc) {
    return $.post(baseUrl + "registeruser", "=" + JSON.stringify({
        'firstName': fName,
        'lastName': lName,
        'login': login,
        'email': email,
        'password': pwd,
        'address': address,
        'city': city,
        'avatarSrc': avatarSrc}));
}
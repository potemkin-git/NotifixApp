var baseUrl = "http://localhost:62002/notifix/api/";
// Call to WS checking if login or email exists
function isLoginorEmailUsed(login, password) {
    return $.post(baseUrl + "checkUniqueLoginEmail", "=" + JSON.stringify({ 'login': login, 'email': password }));
}


// Call to WS checking if login matches provided password
function loginPasswordMatch(login, pwd) {
    return $.post(baseUrl + "checklogin", "=" + JSON.stringify({ 'login': login, 'password': pwd }));
}

function resetPassword(mail) {
    return $.post(baseUrl + "resetpassword", "=" + JSON.stringify({ 'email': mail }));
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
        'avatarSrc': avatarSrc
    }));
}

function updateUser(fName, lName, login, email, pwd, city, address, avatarSrc) {
    return $.post(baseUrl + "updateuser", "=" + JSON.stringify({
        'firstName': fName,
        'lastName': lName,
        'login': login,
        'email': email,
        'password': pwd,
        'address': address,
        'city': city,
        'avatarSrc': avatarSrc
    }));
}


function saveNotification(notification) {
    let hashEsc = encodeURIComponent(hash);
    let notifAsJson = JSON.stringify({
        'type': notification.type,
        'description': notification.desc,
        'expirationDate': new Date(notification.date + ' ' + notification.time),
        'latitude': notification.lat,
        'longitude': notification.lng,
        'nbConf': 0,
        'nbDeny': 0,
        'login': login,
        'hash': hashEsc
    });

    return $.post(baseUrl + "savenotification", "=" + notifAsJson);
}

function notificationVote(notifid, voteValue) {
    return $.post(baseUrl + "votenotification", "=" + JSON.stringify({ 'notifId': notifid, 'vote': voteValue, 'userLogin': login }));
}

function getAllNotifications() {
    return $.get(baseUrl + "getNotifications"); 
}

function getUserInfos(login, hash) {
    let hashEsc = encodeURIComponent(hash);
    return $.post(baseUrl + "userinfos", "=" + JSON.stringify({ 'login': login, 'hash': hashEsc }));
}
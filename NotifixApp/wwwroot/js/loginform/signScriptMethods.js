var baseUrl = "http://localhost:62002/notifix/api/";
// Call to WS checking if login exists
function isLoginUsed(login) {
    return new Promise(function (resolve, reject) {
        // @todo Ajax login validation check
    });
}

// Call to WS checking if email already used
function isPasswordUsed(login) {
    return new Promise(function (resolve, reject) {
        // @todo Ajax password not already used
    });
}

// Call to WS checking if login matches provided password
function loginPasswordMatch(login, pwd) {
    return $.post( baseUrl+ "checklogin", "="+JSON.stringify({'login': login , 'password': pwd}));
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function  registerUser(user) {
    return new Promise(function (resolve, reject) {
        // @todo Persist user info in DB
    });
}
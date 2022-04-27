function logIn() {
    document.getElementById("login-check");
    window.localStorage.setItem("Login")
}

function logInCheck() {
    var logedin = window.localStorage.getItem("Login")

    if (!logedin) {
        return false
    }
    return true
}
const demo = document.getElementById("demo-login");
const username = document.getElementById("username");
const password = document.getElementById("password");
const button = document.getElementById("login-button");

function demoLogin() {
    username.value = "Guest User";
    password.value = "@demo_PW_01";
    button.click();
};


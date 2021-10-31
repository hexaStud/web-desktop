"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const code_database_1 = require("code-database");
const fs = require("fs");
const path = require("path");
const env_1 = require("../../env");
var Login;
(function (Login) {
    function getAllUsers() {
        return JSON.parse(code_database_1.Crypto.decode(fs.readFileSync(path.join(env_1.__root, env_1.DATA_NAME, "system", "config", "user"), "utf-8"), env_1.USER_PSW));
    }
    Login.getAllUsers = getAllUsers;
    function selectUserByName(username) {
        const users = getAllUsers();
        for (const user of users) {
            if (user.username === username) {
                return user;
            }
        }
        return false;
    }
    Login.selectUserByName = selectUserByName;
    function selectUserByIndex(index) {
        const users = getAllUsers();
        if (index < 0 || index > users.length - 1) {
            return false;
        }
        return users[index];
    }
    Login.selectUserByIndex = selectUserByIndex;
    function loadUser(usr) {
        document.body.style.setProperty("--bg-image", `url(../../../${env_1.DATA_NAME}/system/config/background/${usr.style.background})`);
        document.getElementById("loginHeader").innerHTML = usr.username;
        if (usr.password === false) {
            document.forms["loginForm"]["password"].disabled = "true";
            document.forms["loginForm"]["password"].style.opacity = "0";
        }
        else {
            document.forms["loginForm"]["password"].disabled = "false";
            document.forms["loginForm"]["password"].style.opacity = "1";
        }
    }
    Login.loadUser = loadUser;
})(Login = exports.Login || (exports.Login = {}));
//# sourceMappingURL=login.js.map
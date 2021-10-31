"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./login");
const font_1 = require("../../main/font");
const bcrypt = require("bcrypt");
const Sound_1 = require("../../main/Sound");
const desktop_1 = require("./desktop");
let USER;
window.addEventListener("load", () => {
    document.head.appendChild(font_1.Font.buildFont());
    document.body.style.setProperty("--base-font", `"${font_1.Font.listFonts()[0].name}"`);
    let users = login_1.Login.getAllUsers();
    users.forEach((value, index) => {
        const usrEle = document.getElementById("users");
        const div = document.createElement("div");
        div.classList.add("user");
        div.innerHTML = value.username;
        div.addEventListener("click", () => {
            if (!div.classList.contains("active")) {
                document.getElementsByName("user").forEach((value) => {
                    if (value.classList.contains("active")) {
                        value.classList.remove("active");
                    }
                });
                div.classList.add("active");
                login_1.Login.loadUser(users[index]);
            }
        });
        usrEle.appendChild(div);
    });
    document.getElementById("loginForm").addEventListener("submit", (e) => {
        var _a;
        e.preventDefault();
        if (USER.password === false || bcrypt.compareSync(document.forms["loginForm"]["password"].value, USER.password)) {
            let e;
            if (!!(e = Sound_1.Sound.get("startup.mp3"))) {
                e.play();
            }
            desktop_1.Desktop.load(USER);
            (_a = document.getElementById("login")) === null || _a === void 0 ? void 0 : _a.remove();
        }
        else {
            document.forms["loginForm"]["output"].innerHTML = "Account not found";
        }
    });
    USER = users[0];
    login_1.Login.loadUser(USER);
    document.getElementsByClassName("user")[0].classList.add("active");
});
//# sourceMappingURL=index.js.map
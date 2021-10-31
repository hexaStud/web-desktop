import {IUser} from "../../main/IUser";
import {Login} from "./login";
import {Font} from "../../main/font";
import * as bcrypt from "bcrypt";
import {Sound} from "../../main/Sound";
import {Desktop} from "./desktop";

let USER: IUser;

window.addEventListener("load", () => {
    document.head.appendChild(Font.buildFont());
    document.body.style.setProperty("--base-font", `"${Font.listFonts()[0].name}"`);

    let users: IUser[] = Login.getAllUsers();
    users.forEach((value, index) => {
        const usrEle: HTMLElement = <HTMLElement>document.getElementById("users");
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
                Login.loadUser(users[index]);
            }
        });
        usrEle.appendChild(div);
    });

    (<HTMLElement>document.getElementById("loginForm")).addEventListener("submit", (e) => {
        e.preventDefault();

        // @ts-ignore
        if (USER.password === false || bcrypt.compareSync(document.forms["loginForm"]["password"].value, USER.password)) {
            let e: Sound | false;
            if (!!(e = Sound.get("startup.mp3"))) {
                e.play();
            }
            Desktop.load(USER);
            document.getElementById("login")?.remove();
        } else {
            // @ts-ignore
            document.forms["loginForm"]["output"].innerHTML = "Account not found"; // TODO add translation service
        }
    });

    USER = users[0];
    Login.loadUser(USER);
    document.getElementsByClassName("user")[0].classList.add("active");
});

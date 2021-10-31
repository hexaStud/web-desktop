import {ipcRenderer} from "electron";

const output: HTMLElement = <HTMLElement>document.getElementById("output");

ipcRenderer.on("msg", (event, args) => {
    output.innerHTML += args + "\n";
    window.scrollTo({
        top: window.scrollY
    });
});

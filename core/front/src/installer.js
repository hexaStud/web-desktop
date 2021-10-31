"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const output = document.getElementById("output");
electron_1.ipcRenderer.on("msg", (event, args) => {
    output.innerHTML += args + "\n";
    window.scrollTo({
        top: window.scrollY
    });
});
//# sourceMappingURL=installer.js.map
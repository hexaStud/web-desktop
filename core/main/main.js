"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const env_1 = require("../env");
const installer_1 = require("./installer");
const electron_1 = require("electron");
electron_1.app.on("ready", () => {
    const win = new electron_1.BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });
    win.setMenu(null);
    win.webContents.openDevTools();
    if (!fs.existsSync(path.join(env_1.__root, env_1.DATA_NAME))) {
        win.webContents.on("did-finish-load", () => {
            installer_1.Installer.onMessage((msg) => {
                win.webContents.send("msg", msg);
            });
            installer_1.Installer.install(path.join(env_1.__root, env_1.DATA_NAME));
            electron_1.app.relaunch();
        });
        win.loadFile(path.join(env_1.__front, "installer.html"));
    }
    else {
        win.loadFile(path.join(env_1.__front, "index.html"));
    }
});
//# sourceMappingURL=main.js.map
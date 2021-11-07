import * as fs from "fs";
import * as path from "path";
import {__front, __root, DATA_NAME} from "../env";
import {Installer} from "./installer";
import {app, BrowserWindow, ipcMain} from "electron";

app.on("ready", () => {
    const win: BrowserWindow = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegrationInSubFrames: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });

    ipcMain.on("shutdown", () => {
        win.destroy();
        app.quit();
    });

    ipcMain.on("restart", () => {
        win.destroy();
        app.relaunch();
    });

    win.setMenu(null);
    win.webContents.openDevTools();

    if (!fs.existsSync(path.join(__root, DATA_NAME))) {
        win.webContents.on("did-finish-load", () => {
            Installer.onMessage((msg) => {
                win.webContents.send("msg", msg);
            });

            Installer.install(path.join(__root, DATA_NAME));
            app.relaunch();
        });

        win.loadFile(path.join(__front, "installer.html"));
    } else {
        win.loadFile(path.join(__front, "index.html"));
    }
});



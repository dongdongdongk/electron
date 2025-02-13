const { BrowserWindow } = require('electron')
const path = require("path");

class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        super(
            {
                title: "SysTop",
                width: isDev ? 700 : 355,
                height: 500,
                icon: "./assets/icons/icon.png",
                resizable: isDev ? true : false,
                // show: false,
                opacity: 0.9,
                backgroundColor: "white",
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: path.join(__dirname, "preload.js"),
                },
            }
        )
        this.loadFile(file);

        if (isDev) {
            this.webContents.openDevTools();
        }
    }
}

module.exports = MainWindow
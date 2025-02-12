const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const Store = require('./store')
const log = require("electron-log");

const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// Set env
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;

// Init store & defaults 
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    }
  }
})

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "SysTop",
    width: isDev ? 700 : 355,
    height: 500,
    icon: "./assets/icons/icon.png",
    resizable: isDev ? true : false,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile("./app/index.html");
}

app.on("ready", () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.handle("getComInfo", async () => {
  const cpuModel = await cpu.model(); // CPU 모델 정보를 가져옴
  const compName = await os.hostname(); // 컴퓨터 이름을 가져옴
  const osInfo = await `${os.type()} ${os.arch()}` // 운영체제 정보를 가져옴
  const memInfo = await mem.info(); // 메모리 정보
  return { model: cpuModel, compName: compName, osInfo: osInfo, memInfo: memInfo}; // 정보를 반환
});


ipcMain.handle("getCpuUsage", async () => {
  const usage = await cpu.usage(); // CPU 사용량 가져오기
  return parseFloat(usage.toFixed(2)); // 소수점 2째 자리까지 표시
});

ipcMain.handle("getUptime", async () => {
  return Math.floor(os.uptime()); // 소수점 없이 정수 값만 반환 시스템 가동 시간
});

app.allowRendererProcessReuse = true;

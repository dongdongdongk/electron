const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const MainWindow = require('./MainWindow')
const Store = require('./store')
const AppTray = require('./AppTray')

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
let tray

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
  mainWindow = new MainWindow('./app/index.html',isDev);
}

app.on("ready", () => {
  console.log(app.getPath('userData'));
  createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }
    return true
  })

  const icon = path.join(__dirname,'assets','icons','tray_icon.png')

  tray = new AppTray(icon, mainWindow)

  mainWindow.on('ready',() => (mainWindow = null))
});

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu",
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Navigation',
        click: () => mainWindow.webContents.send('nav:toggle')
      }
    ]
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

// 설정 저장하기
ipcMain.on("settings:set", (event, newSettings) => {
  store.set("settings", newSettings);
  console.log("새 설정 저장됨:", newSettings);

  // 변경된 설정을 렌더러 프로세스로 다시 보내기 (즉시 UI 반영)
  mainWindow.webContents.send("settings:get", store.get("settings"));
});

app.allowRendererProcessReuse = true;

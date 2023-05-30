/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  Menu,
  // dialog,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { resizeWindow } from './ipcMain/opSize';
import {
  selectFilePath,
  selectFile,
  saveFile,
  readFiles,
} from './ipcMain/opFiles';

// export function abc() {
//   return 'abc';
// }
export type mainWindowType = BrowserWindow | null;

const appMenu = [
  {
    label: '编辑',
    submenu: [
      { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
    ],
  },
];
const initAppMenu = () => {
  const menu = Menu.buildFromTemplate(appMenu);
  Menu.setApplicationMenu(menu);
};
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: mainWindowType;
// 用来监控macOs系统下是否将应用关闭至托盘,暂时注掉，后续单例处理再放开
// let isActive: boolean = false;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example-reply', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

let loadingPage;

// 这里的loading待项目成型后再考虑加不加，其本身目的是优化用户体验，让等待加载主进程窗口的时间出现小窗口的loading过渡，后续想在主项目里加loading，但这里对比一下时间
const showLoading = () => {
  loadingPage = new BrowserWindow({
    show: false,
    frame: false, // 无边框（窗口、工具栏等），只包含网页内容
    width: 240,
    height: 240,
    resizable: false,
    webPreferences: {
      devTools: false,
    },
    transparent: true, // 窗口是否支持透明，如果想做高级效果最好为true
  });

  loadingPage.loadURL(resolveHtmlPath('loadingPage.html'));
  loadingPage.show();
};

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }
  // isActive = false;

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    // 初始化大小
    width: 1000,
    height: 800,
    // 最小窗口大小
    minWidth: 1000,
    minHeight: 600,
    icon: getAssetPath('icon.svg'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // 去掉顶部通知栏，如果这里全隐藏复制粘贴等功能也会被禁用，macOs上有这种问题；
  if (process.platform === 'darwin') {
    // 所以macOs下还是保留复制粘贴功能，只去掉顶部通知栏
    initAppMenu();
  } else {
    // win和linux平台，直接去掉顶部通知栏
    Menu.setApplicationMenu(null);
  }

  globalShortcut.register('CommandOrControl+Shift+D', () => {
    mainWindow?.webContents?.openDevTools(); // 开启开发者工具
  });

  if (process.env.NODE_ENV === 'development') {
    // 开发环境主动打开开发者工具
    mainWindow?.webContents?.openDevTools({ mode: 'undocked' }); // 开启开发者工具
  }

  // 针对windows和linux平台，去掉顶部菜单栏；下面的 Menu.setApplicationMenu针对各平台都能用
  mainWindow.removeMenu();

  // 主进程准备渲染
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    console.log('测试关闭>>>>>', BrowserWindow.getAllWindows().length === 0);
    if (process.platform === 'darwin') {
      // macOs下点击关闭不是直接退出程序而是隐藏到托盘里
      // isActive = true;
    }
    mainWindow = null;
  });

  // 这里可以绑定通知栏上的菜单项
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  /**
   * Add event listeners... 此处添加事件监听
   */
  // 选择路径,函数里执行的是on监听showOpenDialog事件触发
  selectFilePath(mainWindow);
  // 选择文件，函数里执行的是on监听showSaveDialog事件触发
  selectFile(mainWindow);
  // 选择文件路径并保存，函数里执行的是on监听saveFile事件触发
  saveFile(mainWindow);
  // 读取文件
  readFiles(mainWindow);
  // 重置窗口大小，函数里执行的是on监听setSize事件触发，当时login时会重置窗口大小
  resizeWindow(mainWindow);
};

// 使用单例模式，防止多开;这里可能会有bug，如果程序崩溃了，再次打开会提示已经有程序在运行，目前暂时没思路，先不用单例模式，直接允许多开，后续再解决此问题
// const gotTheLock = app.requestSingleInstanceLock();
// if (!gotTheLock) {
//   // 如果已经有同样的该程序正在运行，则不启动
//   app.quit();
// } else {
//   // 如果检测到有同样的该程序正在试图启动...
//   app.on('second-instance', () => {
//     if (mainWindow) {
//       // 弹出系统提示对话框
//       dialog.showMessageBox({
//         message: '此程序已经正在运行1',
//       });
//       // 如果该程序窗口处于最小化状态，则恢复窗口
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       // 将该程序窗口置为当前聚焦态
//       mainWindow.focus();
//     } else if (isActive) {
//       dialog.showMessageBox({
//         message: '此程序已在托盘中运行',
//       });
//     }
//   });
//   // 关闭所有窗口后退出
//   app.on('window-all-closed', () => {
//     // 在macOS上，应用程序及其菜单栏通常保持活动状态，直到用户使用Cmd+Q明确退出；
//     // 这段代码表示除了macOs之外的所有平台，都会在所有窗口关闭后退出应用程序。
//     if (process.platform !== 'darwin') {
//       app.quit();
//     }
//   });

//   // 这段程序将会在 Electron 结束初始化
//   // 和创建浏览器窗口的时候调用
//   // 部分 API 在 ready 事件触发后才能使用。
//   app
//     .whenReady()
//     .then(() => {
//       createWindow();
//       app.on('activate', () => {
//         console.log('macOs》》》》》');

//         // 在 macOS 系统内, 如果没有已开启的应用窗口,点击托盘图标时通常会重新创建一个新窗口
//         if (mainWindow === null) {
//           console.log('重新创建一个新窗口');
//           createWindow();
//         }
//       });
//     })
//     .catch(console.log);
// }

// 关闭所有窗口后退出
app.on('window-all-closed', () => {
  // 在macOS上，应用程序及其菜单栏通常保持活动状态，直到用户使用Cmd+Q明确退出；
  // 这段代码表示除了macOs之外的所有平台，都会在所有窗口关闭后退出应用程序。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // 在 macOS 系统内, 如果没有已开启的应用窗口,点击托盘图标时通常会重新创建一个新窗口
      if (mainWindow === null) {
        console.log('重新创建一个新窗口');
        createWindow();
      }
    });
  })
  .catch(console.log);

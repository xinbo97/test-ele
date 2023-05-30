import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import { mainWindowType } from '../main';

// 选择路径
export const selectFilePath = (mainWindow: mainWindowType) => {
  ipcMain.on('showOpenDialog', async (event) => {
    if (mainWindow) {
      await dialog
        .showOpenDialog(mainWindow, {
          properties: ['openDirectory'],
        })
        .then((result) => {
          event.reply('filePath', result.filePaths);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

// 选择文件
export const selectFile = (mainWindow: mainWindowType) => {
  ipcMain.on('showSaveDialog', async (event, arg) => {
    if (mainWindow) {
      await dialog
        .showSaveDialog(mainWindow, {
          properties: ['showHiddenFiles'],
          ...arg,
        })
        .then((result) => {
          const res = result.filePath;
          // 回调
          event.reply('filePath', res);
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

// 选择文件路径并保存
export const saveFile = (mainWindow: mainWindowType) => {
  ipcMain.on('saveFile', async (event, arg) => {
    if (mainWindow) {
      await dialog
        .showSaveDialog(mainWindow, {
          title: 'methodFile',
        })
        .then((result) => {
          const res = result.filePath;
          fs.writeFile(res!, arg, (error) => {
            if (error) {
              return console.log(error);
            }
            event.reply('saveFile', res);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

export const readFiles = (mainWindow: mainWindowType) => {
  // 读取文件
  ipcMain.on('openFile', async (event, arg) => {
    if (mainWindow) {
      await dialog
        .showOpenDialog(mainWindow, {
          properties: ['showHiddenFiles'],
        })
        .then((result) => {
          fs.readFile(result.filePaths[0], (err, data) => {
            if (err) throw err;
            event.reply('openFile', data, result.filePaths[0], arg);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

import { ipcMain } from 'electron';
import { mainWindowType } from '../main';

export const resizeWindow = (mainWindow: mainWindowType) => {
  ipcMain.on('setSize', (event, arg) => {
    if (mainWindow) {
      // 设置登录固定窗口大小
      if (arg === 'login') {
        mainWindow.restore();
        mainWindow.setSize(1000, 600, true);
        mainWindow.center();
      }
    }
  });
};

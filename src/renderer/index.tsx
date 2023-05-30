import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import 'normalize.css';
import '@demo/common/styles/index.less';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </HashRouter>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example-reply', (arg: any) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

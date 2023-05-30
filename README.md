## 说明介绍

```bash
安装依赖
npm i
运行项目
npm start
打包构建
npm run build
```

## 目录说明

```bash
|-src
  |-redux
    |-store
    |-modules  各reducer模块数据
      |-按页面名命名文件夹eg：loginSlice
        |-index.ts  放slice里的reducer
        |-type.ts  放类型
      |-跨页面的使用按功能性分文件夹eg：permissionSlice、userInfoSlice
        |-index.ts
        |-type.ts

```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

[github-actions-status]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/workflows/Test/badge.svg
[github-actions-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/electron-react-boilerplate/electron-react-boilerplate/releases/latest
[stackoverflow-img]: https://img.shields.io/badge/stackoverflow-electron_react_boilerplate-blue.svg
[stackoverflow-url]: https://stackoverflow.com/questions/tagged/electron-react-boilerplate

/*
 * @Author: huanggaoqing huanggaoqing@xender.com
 * @Date: 2023-09-20 14:40:36
 * @LastEditors: huanggaoqing huanggaoqing@xender.com
 * @LastEditTime: 2023-09-21 08:52:56
 * @FilePath: \electron_webview\background.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { app, BrowserWindow, ipcMain, } from "electron"
import * as remoteMain from '@electron/remote/main';
import path from "path"

remoteMain.initialize()
const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      webviewTag: true,
    },
  })

  remoteMain.enable(win.webContents)

  ipcMain.handle("getAppPath", () => {
    return app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
  })

  win.webContents.on('did-attach-webview', (event, webview: any) => {
    console.log(path.join(__dirname, 'dist-electron/index.js'))
    webview.webpreferences = {
      preload: path.join(__dirname, 'dist-electron/index.js')
    }

  })

  // 获取本地 preload.js 文件的路径
  const preloadPath = path.join(__dirname, "preload.js");
  global.shareObject = {
    webviewPreload: path.join(__dirname, "preload.js")
  }
  // 如果打包了，渲染index.html
  if (process.env.NODE_ENV !== 'development') {
    win.loadFile(path.join(__dirname, "./index.html"))
    win.webContents.openDevTools()
  } else {
    let url = "http://localhost:5173" // 本地启动的vue项目路径。注意：vite版本3以上使用的端口5173；版本2用的是3000
    win.loadURL(url)
    win.webContents.openDevTools()
  }

  win.webContents.on('did-finish-load', () => {
    // 在网页加载完成后，将本地 preload.js 文件的路径发送到渲染进程
    win.webContents.send('preload-path', preloadPath);
  });
}


app.whenReady().then(() => {
  createWindow() // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
}) 

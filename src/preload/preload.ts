/*
 * @Author: huanggaoqing huanggaoqing@xender.com
 * @Date: 2023-09-20 15:04:00
 * @LastEditors: huanggaoqing huanggaoqing@xender.com
 * @LastEditTime: 2023-10-11 08:47:07
 * @FilePath: \electron_webview\src\preload\preload.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { ipcRenderer, contextBridge } from "electron"

// 暴露方法给webview
contextBridge.exposeInMainWorld('$native', {
  send(event:string, args: any) {
    ipcRenderer.sendToHost(event, args)
  },
  on(event: string, callback: any) {
    ipcRenderer.on(event, callback)
  }
})

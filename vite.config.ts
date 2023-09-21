/*
 * @Author: huanggaoqing huanggaoqing@xender.com
 * @Date: 2023-09-20 14:36:41
 * @LastEditors: huanggaoqing huanggaoqing@xender.com
 * @LastEditTime: 2023-09-21 08:53:46
 * @FilePath: \electron_webview\vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRenderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry: "background.ts", // 主进程文件
      },
      {
        entry: "src/preload/preload.ts"
      }
    ]),
    electronRenderer(),
  ],
})

/*
 * @Author: huanggaoqing huanggaoqing@xender.com
 * @Date: 2023-10-16 10:03:38
 * @LastEditors: huanggaoqing huanggaoqing@xender.com
 * @LastEditTime: 2023-10-17 13:26:26
 * @FilePath: \electron_webview\src\mainSrc\download.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */

import path from "path";
import fs from "fs";
import { BrowserWindow, DownloadItem, app } from "electron";
import Store from 'electron-store'
const store = new Store()

interface IOptions {
  thid: string;
  url: string; // 链接
  fileName: string; // 文件名
  itag: string; // itag
  format: string
}

interface ICacheItem {
  path: string;
  eTag: string;
  urlChain: string[];
  length: number;
  lastModified: string;
  startTime: number
  speedBytes: number
  offset: number
  realPath: string
}

interface IDonwloadMrg {
  [key: string]:  {
    [key: string]: ICacheItem
  }
}

type ProgressCallback = (progress: number, speedBytes:number) => void

export default class Donwload {

  private static downloadMrg: IDonwloadMrg = store.get("downloadMrg") as IDonwloadMrg

  private savePath: string;

  private options: IOptions

  private win: BrowserWindow;

  private progress: ProgressCallback | null = null

  private cacheItem: ICacheItem = {} as ICacheItem

  private tmpPath: string = ""

  constructor(winId:number, option: IOptions) {
    this.savePath = path.join( 
      this.dirIsExists(path.join("C:/Users/33597/Music/test/video", option.itag)), 
      option.fileName + option.format
    )
    this.tmpPath = this.savePath + ".tmp"
    this.options = option
    this.win = BrowserWindow.fromId(winId)!;
    if (this.win === null) {
      throw new Error("win is null");
    }
    this.initEvent()
  }

  private dirIsExists(path: string): string {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    return path
  }

  private initEvent() {
    app.once("before-quit", () => {
      fs.copyFileSync(this.savePath, this.tmpPath)
      this.reloadCache()
    })
    this.win.webContents.session.addListener("will-download", (_, item) => {
      item.resume()
      this.saveDownloadItem(item)
      item.on("updated", this.handleUpdate(item))
      item.on("done", this.handleDone.bind(this))
    })
  }

  private handleDone(_:any, state:'completed' | 'cancelled' | 'interrupted') {
    this.reloadCache()
    if (state === "interrupted") {
      // interrupted
    } else if (state === "cancelled") {
      // cancelled
    } else {
      // completed
    }
  }

  private saveDownloadItem(item: DownloadItem) {
    item.setSavePath(this.savePath)
    this.cacheItem.path = item.getSavePath();//图片地址
    this.cacheItem.eTag = item.getETag();//资源标识
    this.cacheItem.urlChain = item.getURLChain();//地址
    this.cacheItem.length = item.getTotalBytes()//资源大小
    this.cacheItem.lastModified = item.getLastModifiedTime()//资源最后一次更新的时间
    this.cacheItem.startTime = item.getStartTime();
    this.reloadCache()
  }

  private reloadCache() {
    Donwload.downloadMrg[this.options.thid] = {
      [this.options.itag]: this.cacheItem
    };
    store.set("downloadMrg", Donwload.downloadMrg)
  }

  private handleUpdate(currentItem: DownloadItem) {
    let lastBytes = 0
    return (_: any, state:'progressing' | 'interrupted') => {
      if (state === 'progressing') {
        if (currentItem.isPaused()) {
          this.reloadCache()
        } else {
          let offset = currentItem.getReceivedBytes();
          this.cacheItem.speedBytes = offset - lastBytes;//下载速度
          this.cacheItem.offset = offset//已经下载
          lastBytes = offset
          const progress = (currentItem.getReceivedBytes() / currentItem.getTotalBytes()) * 100;
          this.progress?.(progress, this.cacheItem.speedBytes) 
        }
      }
    }
  }

  public setProgressCallback(callback: ProgressCallback): void {
    this.progress = callback
  }

  public start(): void {
    const cacheItem = Donwload.downloadMrg[this.options.thid]?.[this.options.itag]
    const isTmp = fs.existsSync(this.tmpPath)
    if (cacheItem) {
      if (fs.existsSync(cacheItem.path) || isTmp) {
        if (cacheItem.offset === cacheItem.length) {
          console.log("文件已存在");
          return
        }
        if (isTmp) {
          fs.renameSync(this.tmpPath, this.savePath)
        }
        this.win.webContents.session.createInterruptedDownload({
          path: cacheItem.path, 
          urlChain: cacheItem.urlChain, 
          offset: cacheItem.offset, // 下载断点开始位置
          length: cacheItem.length, 
          lastModified: cacheItem.lastModified, //
          eTag: cacheItem.eTag, // 
          startTime: cacheItem.startTime
        })
        return
      } else {
        this.cacheItem = {} as ICacheItem
        this.reloadCache()
      }
    }
    this.win.webContents.downloadURL(this.options.url)
  }
}

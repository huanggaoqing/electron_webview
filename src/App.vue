<!--
 * @Author: huanggaoqing huanggaoqing@xender.com
 * @Date: 2023-09-20 14:36:41
 * @LastEditors: huanggaoqing huanggaoqing@xender.com
 * @LastEditTime: 2023-09-21 13:34:06
 * @FilePath: \electron_webview\src\App.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as remote from "@electron/remote"

const webviewController = ref()
const info = ref({} as {
  name: string,
  desc: string
})

onMounted(() => {
  webviewController.value?.addEventListener("dom-ready", async () => {
    webviewController.value?.openDevTools()
  })
  webviewController.value.addEventListener('ipc-message', handleWebviewMessage)
})

function handleWebviewMessage({channel, args}: any) {
  console.log({channel, args})
  if (channel === "PING") {
    webviewController.value?.send("PONG", {channel: "native"})
  }
}

function getPreloadPath() {
  return remote.getGlobal('shareObject').webviewPreload
}

async function getInfo(): Promise<void> {
  info.value = await webviewController.value.executeJavaScript("getInfo()")
  console.log({info: info.value})
}

function injectCssToWebview() {
  webviewController.value.insertCSS(`
    .mnav{
      color: red !important;
    }
  `)
}
</script>

<template>
  <div>
    <button @click="getInfo" >get info</button>
    <div>
      <div>name: {{ info.name }}</div>
      <div>desc: {{ info.desc }}</div>
    </div>
    <button @click="injectCssToWebview" >inject css to webview</button>
    <webview
      ref="webviewController"
      id="foo"
      src="https://www.baidu.com/"
      style="display:inline-flex; width:750px; height: calc(100vh - 5px)"
      :preload="getPreloadPath()"
    >
    </webview>
  </div>
</template>

<style scoped></style>

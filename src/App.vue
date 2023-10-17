<!--
 * @Author: huanggaoqing huanggaoqing@xender.com
 * @Date: 2023-09-20 14:36:41
 * @LastEditors: huanggaoqing huanggaoqing@xender.com
 * @LastEditTime: 2023-10-17 08:30:58
 * @FilePath: \electron_webview\src\App.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ipcRenderer } from "electron";

// const webviewController = ref()
// const info = ref({} as {
//   name: string,
//   desc: string
// })

// onMounted(() => {
//   webviewController.value?.addEventListener("dom-ready", async () => {
//     webviewController.value?.openDevTools()
//   })
//   webviewController.value.addEventListener('ipc-message', handleWebviewMessage)
// })

// function handleWebviewMessage({channel, args}: any) {
//   console.log({channel, args})
//   if (channel === "PING") {
//     webviewController.value?.send("PONG", {channel: "native"})
//   }
// }

// function getPreloadPath() {
//   return remote.getGlobal('shareObject').webviewPreload
// }

// async function getInfo(): Promise<void> {
//   info.value = await webviewController.value.executeJavaScript("getInfo()")
//   console.log({info: info.value})
// }

// function injectCssToWebview() {
//   webviewController.value.insertCSS(`
//     .mnav{
//       color: red !important;
//     }
//   `)
// }

function handleDownload() {
  console.log("start download")
  ipcRenderer.send("start_download", {
      thid: "FJ0CRDzsuCs",
      url: " https://rr1---sn-i3b7knsl.googlevideo.com/videoplayback?expire=1697524237&ei=rdUtZeT0F7Xt2roP2Nm2uAE&ip=103.206.191.37&id=o-AA0NqaEfs2NrF3Ml5kR96TenOr24YSWi_cei5-pxsPAx&itag=22&source=youtube&requiressl=yes&mh=2P&mm=31%2C26&mn=sn-i3b7knsl%2Csn-oguesnd6&ms=au%2Conr&mv=m&mvi=1&pl=24&gcr=hk&initcwndbps=576250&spc=UWF9f9_49JTrD-J_rsOqtkgdit1WUkM&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=161.401&lmt=1681309568109945&mt=1697502068&fvip=3&fexp=24007246&beids=24350018&c=ANDROID&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AGM4YrMwRQIhAIj_mcQnsvWKomTD7ZnsGwjoJEhSHYRWp10S84N6qX2nAiBnB_pceXHqIQcrm698B3-4ucxA34tVRG_i4rjenrZkqQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AK1ks_kwRQIhAJvt-yHu5ytiyxlCkPphZNf-xN4mx13EyT50888pV1FDAiBSq7DsHySOgdKadFWb5svJhvAXpixZvh4SimZDnJlNYg%3D%3D&th_id=FJ0CRDzsuCs",
      fileName: "Yahritza Y Su Esencia & Grupo Frontera - Frágil (Official Video)",
      itag: "720",
      format: '.mp4'
    })
}
</script>

<template>
  <div>
    <button @click="handleDownload" >start download</button>
    <!-- <button @click="getInfo" >get info</button>
    <div>
      <div>name: {{ info.name }}</div>
      <div>desc: {{ info.desc }}</div>
    </div>
    <button @click="injectCssToWebview" >inject css to webview</button> -->
    <!-- <webview
      ref="webviewController"
      id="foo"
      src="https://www.baidu.com/"
      style="display:inline-flex; width:750px; height: calc(100vh - 5px)"
      :preload="getPreloadPath()"
    >
    </webview> -->
  </div>
</template>

<style scoped></style>

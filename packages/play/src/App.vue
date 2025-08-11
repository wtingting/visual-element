<script setup lang="ts">
import { onMounted, ref } from 'vue';
const threeRef = ref<any>();
const light = ref<any>();
const onLoading = (url: string, percent: number) => {
  console.log('加载中' + url + ',进度：' + percent)
}
const onComplete = (data: { status: string, model?: any, error?: any }) => {
  console.log('状态：' + data.status)
}
onMounted(() => {
  console.log("container", threeRef.value.container)
  console.log("threeContext", threeRef.value.threeContext)
  console.log("THREE", threeRef.value.THREE)
  threeRef.value.threeContext.scene.add(light.value.light)
})
</script>

<template>
  <div style="width: 100%;height: 100%;">
    <VdThree ref="threeRef" :isStats="true" :isGui="true" :gridHelper="true" :axesHelper="true"
      style="width:100%;height: 100%;">
      <VdScene></VdScene>
      <VdCamera :position="{ x: 0, y: 0, z: 10 }" />
      <VdRenderer></VdRenderer>
      <VdControls></VdControls>
      <VdAmbientLight ref="light" :unMounted="true" />
      <VdDirectionalLight :isHelper="true" :position="{ x: 0, y: 5, z: 5 }" />
      <VdGLTFLoader   path="/models/" @progress="onLoading" @complete="onComplete"
        pathName="chair.glb" />
    </VdThree>
  </div>
</template>

<style scoped></style>

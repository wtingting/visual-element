<script setup lang="ts">
import { useRenderer, type IRendererProps } from './renderer';
defineOptions({
  name: "VdRenderer",
});
const props = withDefaults(defineProps<IRendererProps>(), {
  parameters: () => ({
    //抗锯齿---提升性能可关闭
    antialias: true,
    powerPreference: "high-performance",//"default" / "high-performance" / "low-power"
    // 画布透明
    alpha: true,
    // 解决对冲-避免大场景 Z-fighting
    logarithmicDepthBuffer: true
  }),
  pixelRatio: window.devicePixelRatio || 1,
  toneMapping: 'LinearToneMapping',
  bgColor: '#000000'
})
useRenderer(props)
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

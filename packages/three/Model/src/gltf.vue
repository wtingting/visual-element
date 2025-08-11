<script setup lang="ts">
import { useGLTFLoader, setWireFrame, setWordCenter, type IModel } from './model';

defineOptions({
  name: "VdGLTFLoader",
});
const props = withDefaults(defineProps<IModel>(), {
  /**
   * 几何中心就是局部坐标系的原点。
   * 如果它正好在物体“重心”，那么rotation 会绕着物体“自己”旋转，不会甩出去,scale 会均匀地向四周放大缩小，不会“偏心”。
   * 建模软件里通常把“世界原点”当作导出坐标系的原点,如果模型在 Blender 里就放在原点，导出 .glb/.obj 后 Three.js 直接加载即可，无需再次手动平移。
   */
  wordCenter: true,
});
const emits = defineEmits(['complete', 'progress'])
useGLTFLoader(props, (url, percent: number) => {
  emits('progress', url, percent)
}, (data) => {
  emits('complete', data)
})
defineExpose({
  setWireFrame,
  setWordCenter
})
//透视相机
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

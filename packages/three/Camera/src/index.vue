<script setup lang="ts">
import { useCamera, type ICameraProps } from './camera'
//透视相机
defineOptions({
  name: "VdCamera",
});
const props = withDefaults(defineProps<ICameraProps>(), {
  type:'Perspective',
  fov: 75,
  far: 1000,
  position: () => ({ x: 0, y: 0, z: 10 }),
  lookAt: () => ({ x: 0, y: 0, z: 0 })
});
useCamera(props)
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

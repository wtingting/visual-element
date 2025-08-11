<script setup lang="ts">
import { type IAmbientLightProps, useAmbientLight } from './lights';
defineOptions({
  name: "VdAmbientLight",
});
const props = withDefaults(defineProps<IAmbientLightProps>(), {
  color:'#ffffff',
  intensity:0.3
})
const { light } = useAmbientLight(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>
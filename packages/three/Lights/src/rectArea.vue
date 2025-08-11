<script setup lang="ts">
import { useRectAreaLight, type IRectAreaLightProps } from './lights';

defineOptions({
  name: "VdRectAreaLight",
});
const props = defineProps<IRectAreaLightProps>()
const { light } = useRectAreaLight(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

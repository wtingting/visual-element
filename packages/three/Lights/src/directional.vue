<script setup lang="ts">
import { useDirectionalLight, type IDirectionalProps } from './lights';

defineOptions({
  name: "VdDirectionalLight",
});
const props = withDefaults(defineProps<IDirectionalProps>(), {
  color: '#ffffff',
  intensity: 2.5
})
const { light } = useDirectionalLight(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

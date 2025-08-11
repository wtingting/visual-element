<script setup lang="ts">
import { usePointLight, type IPointLightProps } from './lights';
defineOptions({
  name: "VdPointLight",
});
const props = withDefaults(defineProps<IPointLightProps>(),{
  color:'#ffffff',
  intensity: 2.5
})
const { light } = usePointLight(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

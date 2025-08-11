<script setup lang="ts">
import { useSpotLight, type ISpotLightProps } from './lights';
defineOptions({
  name: "VdSpotLight",
});
const props =withDefaults(defineProps<ISpotLightProps>(),{
  color:'#fff',
  intensity:2.0
})
const { light } = useSpotLight(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

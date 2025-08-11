<script setup lang="ts">
import { useLightProbe, type ILightProbeProps } from './lights';
defineOptions({
  name: "VdLightProbe",
});
const props = defineProps<ILightProbeProps>()
const { light } = useLightProbe(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { useHemisphereLight, type IHemisphereLightProps } from './lights';

defineOptions({
  name: "VdHemisphereLight",
});
const props = withDefaults(defineProps<IHemisphereLightProps>(), {
    skyColor:'#fff',
    groundColor:'#000'
})
const { light } = useHemisphereLight(props);
defineExpose({
  light
})
</script>

<template>
  <slot></slot>
</template>

<style lang="scss" scoped></style>

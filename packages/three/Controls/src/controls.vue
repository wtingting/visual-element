<script setup lang="ts">
import { type IControlProps, useControls } from './controls';

defineOptions({
  name: "VdControls",
});
const props = withDefaults(defineProps<IControlProps>(), {
  maxDistance: 1000,
  enableDamping: true,
  target: () => ({ x: 0, y: 0, z: -0.2 })
})
useControls(props);
</script>

<template>
</template>

<style lang="scss" scoped></style>

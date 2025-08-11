<script setup lang="ts">
import { useThree, type IThreeProps } from './container';
defineOptions({
  name: "VdThree",
});
const props = withDefaults(defineProps<IThreeProps>(), {
  isLoop: true
})
const { container, threeContext, THREE } = useThree(props);
defineExpose({
  container,
  threeContext,
  THREE
})
</script>

<template>
  <div ref="container" class="three-scene">
    <slot />
  </div>
</template>
<style scoped>
.three-scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: gray;
}
</style>
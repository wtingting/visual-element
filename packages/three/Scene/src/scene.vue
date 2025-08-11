<script setup lang="ts">
import { createScene } from './scene';

defineOptions({
  name: "VdScene",
});
//创建场景
const scene = createScene()
</script>

<template>
  <slot :scene="scene"></slot>
</template>

<style lang="scss" scoped></style>

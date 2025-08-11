<script setup lang="ts">
import { ref } from 'vue';
import type { ButtonProps } from './type';
defineOptions({
  name: "VeButton",
});
 withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
});
const slots = defineSlots();
const buttonRef = ref<HTMLButtonElement>();
</script>

<template>
  <component :is="tag" ref="buttonRef" :type="tag === 'button' ? nativeType : void 0" class="ve-button" :class="{
    [`ve-button--${type}`]: type,
    [`ve-button--${size}`]: size,
    've-button--disabled': disabled,
    've-button--loading': loading,
    've-button--icon': icon,
    've-button--round': round,
    've-button--circle': circle,
    've-button--plain': plain,
  }" :disable="disabled || loading ? true : void 0">
    <slot v-if="!loading" />
    <span v-else class="ve-button__loading">Loading...</span>
  </component>
</template>

<style  scoped>
@import url('./style.css');
</style>

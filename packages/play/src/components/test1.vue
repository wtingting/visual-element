<script setup lang="ts">
import { inject, onMounted, provide } from 'vue';

defineOptions({
  name: "test",
});

const test = inject('test') as any;
onMounted(() => {
});

</script>

<template>
  <div>{{test.msg}}11</div>
</template>

<style lang="scss" scoped></style>

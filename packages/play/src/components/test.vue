<script setup lang="ts">
import { inject, onMounted, provide } from 'vue';

defineOptions({
  name: "test",
});

const test = inject('test') as any;
test.msg = 'updated message'; // Example of updating the injected data
onMounted(() => {
});

</script>

<template>
  <div>{{test.msg}}</div>
</template>

<style lang="scss" scoped></style>

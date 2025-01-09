<template>
  <Command.List :class="combinedClass">
    <slot />
  </Command.List >
</template>

<script setup lang="ts">
import {  computed } from "vue";
import { cn } from "../../../utils/cn";
import { Command } from 'vue-command-palette'

const props = defineProps<{
  className?: string;
}>();

const combinedClass = computed(() =>
  cn("max-h-[300px] overflow-y-auto overflow-x-hidden", props.className)
);
</script>

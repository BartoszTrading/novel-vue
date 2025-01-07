<template>
  <Command.Item :class="combinedClass">
    <slot />
  </Command.Item>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { cn } from "../../../utils/cn";
import { Command } from 'vue-command-palette'

const props = defineProps<{
  class?: string;
}>();

const combinedClass = computed(() =>
  cn(
    "relative flex cursor-default select-none items-center rounded-sm",
    "px-2 py-1.5 text-sm outline-none",
    "hover:bg-accent hover:text-accent-foreground",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    props.class
  )
);
</script>

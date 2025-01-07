<template>
  <div :class="combinedClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { cn } from "../../../utils/cn";

const props = defineProps<{
  className?: string;
}>();

const combinedClass = computed(() =>
  cn(
    "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
    props.className
  )
);
</script>

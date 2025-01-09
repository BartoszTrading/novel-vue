<template>
  <Command.Group v-bind="$attrs" :class="combinedClass">
    <slot />
  </Command.Group>
</template>

<script setup lang="ts">
import {  computed } from "vue";
import { cn } from "../../../utils/cn";
import { Command } from 'vue-command-palette'

const props = defineProps<{
  className?: string;
}>();

const combinedClass = computed(() =>
  cn(
    "overflow-hidden p-1 text-foreground",
    "[&_[command-group-heading]]:px-2 [&_[command-group-heading]]:py-1.5",
    "[&_[command-group-heading]]:text-xs [&_[command-group-heading]]:font-medium",
    "[&_[command-group-heading]]:text-muted-foreground",
    props.className
  )
);
</script>

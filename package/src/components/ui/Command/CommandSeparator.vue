<template>
  <Command.Separator  :class="combinedClass" />
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { cn } from "../../../utils/cn";
import { Command } from 'vue-command-palette'

const props = defineProps<{
  className?: string;
}>();

const combinedClass = computed(() =>
  cn("-mx-1 h-px bg-border", props.className)
);
</script>

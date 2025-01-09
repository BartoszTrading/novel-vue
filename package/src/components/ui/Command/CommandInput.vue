<template>
  <div class="flex items-center border-b px-4" cmdk-input-wrapper>
    <Magic class="mr-2 h-4 w-4 shrink-0 text-purple-500" />
    <Command.Input
    v-bind="$attrs"
      :class="combinedClass"
      :value="modelValue"
      @input="onInput"
      autoFocus
      @focus="$emit('focus')"
      placeholder="Type a command..."
    />
  </div>
</template>

<script setup lang="ts">
import {   computed,onMounted } from "vue";
import { cn } from "../../../utils/cn";
import { Command } from 'vue-command-palette'
import Magic from "./Magic.vue";

const props = defineProps<{
  modelValue?: string;
  class?: string;
}>();

const emits = defineEmits(["update:modelValue",'focus','onFocus']);
onMounted(async () => {
  console.log('mounted')
  emits('focus')


})

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emits("update:modelValue", target.value);
}

const combinedClass = computed(() =>
  cn(
    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none",
    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    props.class
  )
);
</script>

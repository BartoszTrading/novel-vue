<template>
  <!-- 
    1) Root 
  -->
  <ScrollAreaRoot
    ref="root"
    :class="['relative overflow-hidden', className]"
    v-bind="otherAttrs"
  >
    <!-- 
      2) Viewport
    -->
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <!-- Render any child content via slot -->
      <slot />
    </ScrollAreaViewport>

    <!-- 
      3) Vertical Scrollbar
    -->
    <ScrollAreaScrollbar orientation="vertical" class="flex touch-none select-none transition-colors w-2.5 border-l border-l-transparent p-[1px]">
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
    </ScrollAreaScrollbar>

    <!-- 
      4) Horizontal Scrollbar (optional)
    -->
    <ScrollAreaScrollbar orientation="horizontal" class="flex touch-none select-none transition-colors h-2.5 flex-col border-t border-t-transparent p-[1px]">
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
    </ScrollAreaScrollbar>

    <!-- 
      5) Corner 
    -->
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue"
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from "radix-vue"

const props = defineProps<{
  className?: string;
  // Any other props you want to pass through
  [key: string]: any;
}>()

/** 
 * Separate out `className` from other potential props 
 * (similar to how you'd do in React with { className, children, ...props }).
 */
const { className = '', ...otherAttrs } = props

// If you need a reference to the root element, you can store it here:
const root = ref<HTMLElement | null>(null)

// Additional setup or watchers can go here
</script>

<style scoped>
/* Your optional styling overrides here. */
</style>

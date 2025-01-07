<template>
  <!-- Group 1: Edit or review selection -->
  <CommandGroup heading="Edit or review selection">
    <CommandItem
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      class="flex gap-2 px-4"
      @select="() => handleSelect(option.value)"
    >
      <!-- Replace this with the proper Vue-based Lucide icon component -->
      <component :is="option.icon" class="h-4 w-4 text-purple-500" />
      {{ option.label }}
    </CommandItem>
  </CommandGroup>

  <CommandSeparator />

  <!-- Group 2: Use AI to do more -->
  <CommandGroup heading="Use AI to do more">
    <CommandItem
      value="continue"
      class="gap-2 px-4"
      @select="handleContinue"
    >
      <!-- Replace this with the proper Vue-based Lucide icon component -->
      <component :is="StepForward" class="h-4 w-4 text-purple-500" />
      Continue writing
    </CommandItem>
  </CommandGroup>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/core"
import { RefreshCcwDot, CheckCheck,StepForward, ArrowDownWideNarrow, WrapText } from "lucide-vue-next"
import { defineProps } from "vue"
import CommandGroup from "../ui/Command/CommandGroup.vue"
import CommandItem from "../ui/Command/CommandItem.vue"
import CommandSeparator from "../ui/Command/CommandSeparator.vue"


// Utility function similarly requires a Vue replacement
function getPrevText(_editor: any, pos: number) {
  // Mock some logic
  return "Some previous text near position " + pos
}

// If CommandGroup, CommandItem, CommandSeparator are Vue components, import them here:
// import CommandGroup from '../ui/command/CommandGroup.vue'
// import CommandItem from '../ui/command/CommandItem.vue'
// import CommandSeparator from '../ui/command/CommandSeparator.vue'

// ------------------ //
// Options definition
// ------------------ //
interface Option {
  value: string
  label: string
  icon: any
}

const options: Option[] = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },
  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
]

// ------------------ //
// Props + Setup
// ------------------ //
const props = defineProps<{
  editor:  Editor

}>()

const emit = defineEmits(["select"])

// In Vue, we can call our mocked useEditor composable

function handleSelect(value: string) {
  // Extract text from the editor's current selection (mocked logic)
  const slice = props.editor.state.selection.content()
  const text = props.editor.storage.markdown.serializer.serialize(slice.content)
  emit('select',{text, value})
}

function handleContinue() {
  const pos = props.editor.state.selection.from
  const text = getPrevText(props.editor, pos)
  emit('select',{text, value: 'value'})
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>

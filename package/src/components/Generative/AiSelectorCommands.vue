<template>
  <!-- Group 1: Edit or review selection -->
  <template v-for="group,index in groups">
  <CommandSeparator v-if="index !== 0" />
  <CommandGroup  :heading="group.heading">
    <CommandItem
      v-for="option in group.options"
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

  </template>


</template>

<script setup lang="ts">
import { Editor } from "@tiptap/core"
import { defineProps } from "vue"
import CommandGroup from "../ui/Command/CommandGroup.vue"
import CommandItem from "../ui/Command/CommandItem.vue"
import CommandSeparator from "../ui/Command/CommandSeparator.vue"
import { Group } from "./AiSelectorCommands.types"



// ------------------ //
const props = defineProps<{
  editor:  Editor
  groups: Group[]
}>()

const emit = defineEmits(["select"])

// In Vue, we can call our mocked useEditor composable

function handleSelect(value: string) {
  // Extract text from the editor's current selection (mocked logic)
  const slice = props.editor.state.selection.content()
  console.log(slice)
  console.log(props.editor.storage.markdown.serializer)
  const text = props.editor.storage.markdown.serializer.serialize(slice.content)
  console.log(text)
  emit('select',{text, value})
}

</script>

<style scoped>
/* Add your styles here if needed */
</style>

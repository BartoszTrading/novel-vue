<template>
  <CommandGroup>
    <!-- Replace Selection -->
    <CommandItem
      class="gap-2 px-4"
      value="replace"
      @select="replaceSelection"
    >
      <component :is="Check" class="h-4 w-4 text-muted-foreground" />
      Replace selection
    </CommandItem>

    <!-- Insert Below -->
    <CommandItem
      class="gap-2 px-4"
      value="insert"
      @select="insertBelow"
    >
      <component :is="TextQuote" class="h-4 w-4 text-muted-foreground" />
      Insert below
    </CommandItem>
  </CommandGroup>

  <CommandSeparator />

  <CommandGroup>
    <!-- Discard -->
    <CommandItem
      class="gap-2 px-4"
      value="thrash"
      @select="onDiscard"
    >
      <component :is="TrashIcon" class="h-4 w-4 text-muted-foreground" />
      Discard
    </CommandItem>
  </CommandGroup>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/core"
import CommandGroup from "../ui/Command/CommandGroup.vue"
import CommandItem from "../ui/Command/CommandItem.vue"
import CommandSeparator from "../ui/Command/CommandSeparator.vue"

// UI components (assumes they are Vue components)

// Lucide icons as Vue components
import { Check, TextQuote, TrashIcon } from 'lucide-vue-next'

interface Props {
  completion: string

  editor: Editor
  onDiscard: () => void
}

// Read props
const {completion,editor,onDiscard} = defineProps<Props>()




// Action: replace the text in the current selection with `props.completion`
function replaceSelection() {
  if (!editor) return
  const selection = editor.view.state.selection
  editor
    .chain()
    .focus()
    .insertContentAt({ from: selection.from, to: selection.to },completion)
    .run()
}

// Action: insert `props.completion` *below* (after current selection)
function insertBelow() {
  if (!editor) return
  const selection = editor.view.state.selection
  editor
    .chain()
    .focus()
    .insertContentAt(selection.to + 1, completion)
    .run()
}
</script>

<style scoped>
/* Your styling here */
</style>

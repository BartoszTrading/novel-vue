<template>
  <Command class=" flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
    <CommandInput class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type a command or search..." />

    <CommandList>
      <Command.Empty>No results found.</Command.Empty>

        <AiSelectorCommands :editor="editor" />

    </CommandList>
  </Command>
</template>
<script lang="ts" setup>
import { Command } from 'vue-command-palette'
import CommandInput  from '../ui/Command/CommandInput.vue'
import AiSelectorCommands from './AiSelectorCommands.vue';
import CommandList  from '../ui/Command/CommandList.vue'
import { Editor } from '@tiptap/core';
import { PropType } from 'vue';
defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

</script>
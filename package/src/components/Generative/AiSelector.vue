<template>
  <Command theme="custom" class=" flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
    <div v-if="completion" className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
    <template v-else>
    <CommandInput @focus="() =>addAIHighlight(editor)" class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type a command or search..." />
    
    
    <CommandList>
      <Command.Empty>No results found.</Command.Empty>

        <AiSelectorCommands @select="(e) => console.log(e)" :groups="aiOptions" :editor="editor" />

    </CommandList>
    </template>
    <AiCompletionCommands @discard="() => console.log('D')" v-if="completion" :completion="completion" @select="(e) => console.log(e)" :editor="editor" />
  </Command>
</template>
<script lang="ts" setup>
import { Command } from 'vue-command-palette'
import CommandInput  from '../ui/Command/CommandInput.vue'
import AiSelectorCommands from './AiSelectorCommands.vue';
import CommandList  from '../ui/Command/CommandList.vue'
import { Editor } from '@tiptap/core';
import { addAIHighlight } from '../extensions/ai-highlight';
import { PropType } from 'vue';
import { Group } from './AiSelectorCommands.types';
import AiCompletionCommands from './AiCompletionCommands.vue';

const completion = 'Some completion text'

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  aiOptions: {
    type: Array as PropType<Group[]>,
    required: true,
  },
});

</script>
<template>
  <Command theme="custom" class=" flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
    <div v-if="completion && !isGenerativeLoading" className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </ScrollArea>
        </div>
        <div v-else-if="isGenerativeLoading" class="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          <Magic class="mr-2 h-4 w-4 shrink-0  " />
          AI is thinking
          <div class="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
    <template v-else-if="!isGenerativeLoading">
    <CommandInput @focus="() =>addAIHighlight(editor)" class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type a command or search..." />
    
    
    <CommandList>
      <Command.Empty>No results found.</Command.Empty>

        <AiSelectorCommands @select="(e) => generateCompletion(e)" :groups="aiOptions" :editor="editor" />

    </CommandList>
    </template>
    <AiCompletionCommands @discard="() => console.log('D')" v-if="completion" :completion="completion"  :editor="editor" />
  </Command>
</template>
<script lang="ts" setup>
import { Command } from 'vue-command-palette'
import CommandInput  from '../ui/Command/CommandInput.vue'
import AiSelectorCommands from './AiSelectorCommands.vue';
import CommandList  from '../ui/Command/CommandList.vue'
import { Editor } from '@tiptap/core';
import ScrollArea from '../ui/ScrollArea/ScrollArea.vue';
import { addAIHighlight } from '../extensions/ai-highlight';
import { PropType, inject, ref } from 'vue';
import { Group } from './AiSelectorCommands.types';
import AiCompletionCommands from './AiCompletionCommands.vue';
import Magic from '../ui/Command/Magic.vue';
import CrazySpinner from '../ui/Command/CrazySpinner.vue';
import { CompletionHandler } from '../Editor.vue';

const isGenerativeLoading = ref(false);

const generativeHandler = inject<CompletionHandler>('generativeHandler');
const completion = ref<string | undefined>();

interface EventAi {
  text: string;
  value: string;
}

async function generateCompletion(event:EventAi) {
  if (!generativeHandler) return;
  isGenerativeLoading.value = true;
  completion.value = await generativeHandler(event.value, event.text);
  isGenerativeLoading.value = false;
}




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
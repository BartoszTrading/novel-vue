<template>
  <BubbleMenu
    :editor="editor"
    :tippyOptions="{
        placement: openAi ? 'bottom-start' : 'top',
        onHidden: (e) => {
          openAi = false;
          
        },
      }"
    class="flex bg-white border divide-x rounded shadow-xl w-fit divide-stone-200 border-stone-200"
  >
    <template v-if="openAi">
    <AiSelector :aiOptions="aiItems" :editor="editor"/>
 
    </template>
    <template v-else>
    <div class="flex">
      <button
        @click="openAi = true"
        class="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        type="button"
      >
      <Magic class="mr-2 h-4 w-4 shrink-0 text-purple-500" />
    </button>
      <NodeSelector :editor="editor" />
      <LinkSelector :editor="editor" />
      <button
        v-for="(item, index) in items"
        :key="index"
        @click="item.command()"
        class="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        type="button"
      >
        <component
          :is="item.icon"
          class="w-4 h-4"
          :class="{
            'text-blue-500': item.isActive(),
          }"
        />
      </button>
      <ColorSelector :editor="editor" />
    </div>
    </template>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { BubbleMenu } from "@tiptap/vue-3";
import { PropType,ref,watch } from "vue";
import { Editor } from "@tiptap/core";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  SigmaIcon,
  CodeIcon,
ArrowDownWideNarrow,
CheckCheck,
RefreshCcwDot,
WrapText,
} from "lucide-vue-next";

import NodeSelector from "./NodeSelector.vue";
import LinkSelector from "./LinkSelector.vue";
import ColorSelector from "./ColorSelector.vue";
import AiSelector from "../Generative/AiSelector.vue";
import Magic from "../ui/Command/Magic.vue";
import { Group } from "../Generative/AiSelectorCommands.types";
import { removeAIHighlight } from "../extensions/ai-highlight";

const openAi = ref<boolean>(false);

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

watch(openAi, (newVal) => {
  if (!newVal) {
    console.log('removing ai highlight')
   removeAIHighlight(props.editor);
  }
});

const items = [
  {
    name: "bold",
    isActive: () => props.editor.isActive("bold"),
    command: () => props.editor.chain().focus().toggleBold().run(),
    icon: BoldIcon,
  },
  {
    name: "italic",
    isActive: () => props.editor.isActive("italic"),
    command: () => props.editor.chain().focus().toggleItalic().run(),
    icon: ItalicIcon,
  },
  {
    name: "underline",
    isActive: () => props.editor.isActive("underline"),
    command: () => props.editor.chain().focus().toggleUnderline().run(),
    icon: UnderlineIcon,
  },
  {
    name: "strike",
    isActive: () => props.editor.isActive("strike"),
    command: () => props.editor.chain().focus().toggleStrike().run(),
    icon: StrikethroughIcon,
  },
  {
    name: "code",
    isActive: () => props.editor.isActive("code"),
    command: () => props.editor.chain().focus().toggleCode().run(),
    icon: CodeIcon,
  },
  {
    name: 'math',
    isActive: () => props.editor.isActive('math'),
    command: () => {
      if (props.editor.isActive("math")) {
        props.editor.chain().focus().unsetLatex().run();
      } else {
        const { from, to } = props.editor.state.selection;
        const latex = props.editor.state.doc.textBetween(from, to);

        if (!latex) return;

        props.editor.chain().focus().setLatex({ latex }).run();
      }    
    },
    icon: SigmaIcon,
  }
];

const aiItems : Group[] = [
  {
    heading: "Edit or review selection",
    options: [
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
    ],
  },
  {
    heading: "Use AI to do more",
    options: [
      {
        value: "summarize",
        label: "Summarize",
        icon: ArrowDownWideNarrow,
      },
      {
        value: "paraphrase",
        label: "Paraphrase",
        icon: ArrowDownWideNarrow,
      },
      {
        value: "translate",
        label: "Translate",
        icon: ArrowDownWideNarrow,
      },
      {
        value: "analyze",
        label: "Analyze",
        icon: ArrowDownWideNarrow,
      },
    ],
  }
];

</script>

<style scoped></style>

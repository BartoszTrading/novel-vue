<template>
  <BubbleMenu
    :editor="editor"
    :tippyOptions="{
      delay: 100,
        placement: openAi ? 'bottom-start' : 'top',
        onHidden: (e) => {
          openAi = false;
          e.hide();
        },
      }"
    class="flex bg-white border divide-x rounded shadow-xl w-fit divide-stone-200 border-stone-200"
  >
    <template v-if="openAi">
    <AiSelector :editor="editor"/>
 
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
import { PropType,ref } from "vue";
import { Editor } from "@tiptap/core";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  SigmaIcon,
  CodeIcon,
} from "lucide-vue-next";

import NodeSelector from "./NodeSelector.vue";
import LinkSelector from "./LinkSelector.vue";
import ColorSelector from "./ColorSelector.vue";
import AiSelector from "../Generative/AiSelector.vue";
import Magic from "../ui/Command/Magic.vue";

const openAi = ref<boolean>(false);

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
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
</script>

<style scoped></style>

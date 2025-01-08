<script setup lang="ts">
import { ref } from "vue";
import Editor from "./components/Editor.vue";
import { Editor as EditorClass } from "@tiptap/core";
import { Group } from "./components/Generative/AiSelectorCommands.types";
import { CheckCheck, RefreshCcwDot,ArrowDownWideNarrow ,WrapText} from "lucide-vue-next";

const generativeHandler = async(eventType: string, text?: string) => {
  return Math.random().toString(36).substring(2,5+2);

};
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

const editor = ref<{ editor: EditorClass }>();
function setContent() {
  if (editor.value) {
    editor.value.editor.commands.setContent({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Example Text",
            },
          ],
        },
      ],
    });
  }
}
</script>

<template>
  <div class="mt-8">
    <button @click="setContent">Set Content</button>
    <Editor :aiItems="aiItems" :generative-handler="generativeHandler"  blob-api="http://localhost:3000/api/upload" completion-api="http://localhost:3000/api/generate" ref="editor" />
  </div>
</template>

<style scoped></style>

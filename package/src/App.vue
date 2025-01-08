<script setup lang="ts">
import { ref } from "vue";
import Editor from "./components/Editor.vue";
import { Editor as EditorClass } from "@tiptap/core";

const generativeHandler = async(eventType: string, text?: string) => {
  return "Hello World";
};

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
    <Editor :generative-handler="generativeHandler" completion="Heeeej" blob-api="http://localhost:3000/api/upload" completion-api="http://localhost:3000/api/generate" ref="editor" />
  </div>
</template>

<style scoped></style>

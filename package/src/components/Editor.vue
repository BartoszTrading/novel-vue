<template>
  <div  :class="className">
    <BubbleMenu v-if="editor" :editor="editor" :ai-items="aiItems"/>
    <EditorContent :editor="editor" />
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { watchEffect, type PropType, ref, watch, provide } from "vue";
import {
  useEditor,
  EditorContent,
  JSONContent,
  Extension,
} from "@tiptap/vue-3";
import { EditorProps } from "@tiptap/pm/view";
import { Editor as EditorClass } from "@tiptap/core";
import { useStorage, useDebounceFn } from "@vueuse/core";

import { defaultEditorContent } from "../lib/default-content";
import { defaultExtensions } from "../components/extensions";
import { defaultEditorProps } from "../lib/props";
import BubbleMenu from "../components/BubbleMenu/index.vue";
import { Toaster,toast } from "sonner";

import { getPrevText } from "../lib/editor";
import { SlashCommandToggles } from "./extensions/slashExtension.types";
import SlashCommand from "./extensions/slashExtension";
import { Group } from "./Generative/AiSelectorCommands.types";
export type CompletionHandler = (eventType: string, text?: string) => Promise<string>;

const props = defineProps({
  /**
   * The API route to use for the Vercel Blob.
   * Defaults to "/api/upload".
   */
  blobApi: {
    type: String,
    default: "/api/upload",
  },
  slashCommands : {
    type: Object as PropType<SlashCommandToggles>,
    required: false,
  },
  /**
   * The API route to use for the OpenAI completion API.
   * Defaults to "/api/generate".
   */
  completionApi: {
    type: String,
    default: "/api/generate",
  },
  /**
   * Additional classes to add to the editor container.
   * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg".
   */
  className: {
    type: String,
    default:
      "relative min-h-[500px] w-full mx-auto max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg",
  },
  /**
   * The default value to use for the editor.
   * Defaults to defaultEditorContent.
   */
  defaultValue: {
    type: Object as PropType<JSONContent>,
    default: () => {
      return defaultEditorContent;
    },
  },
  /**
   * A list of extensions to use for the editor, in addition to the default Novel extensions.
   * Defaults to [].
   */
  extensions: {
    type: Array as PropType<Extension[]>,
    default: [],
  },
  /**
   * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
   * Defaults to {}.
   */
  editorProps: {
    type: Object as PropType<EditorProps>,
    default: {},
  },
  /**
   * A callback function that is called whenever the editor is updated.
   * Defaults to () => {}.
   */
  onUpdate: {
    type: Function as PropType<(editor?: EditorClass) => void | Promise<void>>,
    default: () => {},
  },
  /**
   * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
   * Defaults to () => {}.
   */
  onDebouncedUpdate: {
    type: Function as PropType<(editor?: EditorClass) => void | Promise<void>>,
    default: () => {},
  },
  aiItems: {
    type: Array as PropType<Group[]>,
    required: false,
  },
  completeValue: {
    type: String,
    required: false,
    default:'complete'
  },
  /**
   * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
   * Defaults to 750.
   */
  debounceDuration: {
    type: Number,
    default: 750,
  },
  /**
   * The key to use for storing the editor's value in local storage.
   * Defaults to "novel__content".
   */
  storageKey: {
    type: String,
    default: "novel__content",
  },
  generativeHandler: {
    type: Function as PropType<CompletionHandler>,
    required: false,
  }
  
});

provide("completionApi", props.completionApi);
provide("generativeHandler", props.generativeHandler);

useStorage("blobApi", props.blobApi);



const content = useStorage(props.storageKey, props.defaultValue);

const debouncedUpdate = useDebounceFn(({ editor }) => {
  const json = editor.getJSON();
  content.value = json;
  props.onDebouncedUpdate(editor);
}, props.debounceDuration);

const editor = useEditor({
  extensions: [...defaultExtensions, ...props.extensions, SlashCommand.configure({
    toggles: props.slashCommands,
})],
  editorProps: {
    ...defaultEditorProps,
    ...props.editorProps,
  },
  onUpdate: (e) => {
    const selection = e.editor.state.selection;
    const lastTwo = getPrevText(e.editor, {
      chars: 2,
    });
    // Run the completion API if the user types "++" at the end of the document.
    if (lastTwo === "++" && !isLoading.value && props.generativeHandler) {
      e.editor.commands.deleteRange({
        from: selection.from - 2,
        to: selection.from,
      });
      completionHandler(
        props.completeValue,
        getPrevText(e.editor, {
          chars: 5000,
        })
      );
    } else {
      props.onUpdate(e.editor);
      debouncedUpdate(e);
    }
  },
});

defineExpose({
  editor,
});



const isLoading = ref(false);
const completion = ref<string | null>(null);


const completionHandler = async (eventType: string, text?: string) => {
  if (!props.generativeHandler) return;

  isLoading.value = true;
  completion.value = "";

  try {
    console.log("completionHandler", eventType, text);
    const promiseM = props.generativeHandler(eventType, text)
    // 'toast.promise' returns a Promise that you can await
    const result =  toast.promise(
      promiseM, // <-- your actual async function
      {
        loading: "Generating...",
        success: () => "Done!",
        error: (err) => {
          // If you want dynamic error messages
          return err || "An error occurred";
        },
      }
    );
    console.log(result)
    // 'result' here is the resolved value of your generativeHandler call
    // i.e. the AI completion string, or an object, or whatever generativeHandler returns
    completion.value = await promiseM; // If your generativeHandler returns a string
  } catch (err) {
    console.error(err);
    // Optionally handle any additional error logic here
  } finally {
    isLoading.value = false;
  }
};

watch(
  isLoading,
  (newVal,oldVal) => {
    if(!newVal && oldVal && completion.value) {
      editor.value?.commands.setTextSelection({
      from: editor.value.state.selection.from - completion.value.length,
      to: editor.value.state.selection.from,
    });
    }
  }
)

// Insert chunks of the generated text
watch(
  () => completion.value,
  (newCompletion) => {
    const diff = newCompletion
    if (diff) {
      editor.value?.commands.insertContent(diff);
    }
  }
);

// if user presses escape or cmd + z and it's loading,
// stop the request, delete the completion, and insert back the "++"
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
    stop();
    if (e.key === "Escape" && completion.value) {
      editor.value?.commands.deleteRange({
        from: editor.value.state.selection.from - completion.value.length,
        to: editor.value.state.selection.from,
      });
    }
    editor.value?.commands.insertContent("++");
  }
};

const mousedownHandler = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  stop();
  if (window.confirm("AI writing paused. Continue?")) {
    completionHandler(editor.value?.getText() || "");
  }
};

watch(
  () => isLoading.value,
  (isLoading) => {
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
  }
);

// Load the editor content from local storage on mount.
const hydrated = ref(false);
watchEffect(() => {
  if (editor.value && content.value && !hydrated.value) {
    editor.value.commands.setContent(content.value);
    hydrated.value = true;
  }
});
</script>

<style scoped></style>

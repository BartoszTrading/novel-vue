import { Editor } from "@tiptap/core"
import { Sparkles, MessageSquarePlus, Text, CheckSquare, Heading1, Heading2, Heading3, List, ListOrdered, TextQuote, Code, Image } from "lucide-vue-next"
import { startImageUpload } from "../plugins/upload-images"

export interface SuggestionItem {
  /** A unique identifier for the command. */
  id: string
  /** The label/title of the command. */
  title: string
  /** A short description to show in the UI. */
  description?: string
  /** Search terms for slash menu filtering. */
  searchTerms?: string[]
  /** Icon to display next to the command. */
  icon?: any
  /** The actual command to run, if applicable. */
  command?: (props: { editor: Editor; range: any }) => void
}

export const ALL_SLASH_COMMANDS: SuggestionItem[] = [
  {
    id: "continueWriting",
    title: "Continue writing",
    description: "Use AI to expand your thoughts.",
    searchTerms: ["gpt"],
    icon: Sparkles,
    // If you have an AI command, add it here
    // command: ...
  },
  {
    id: "feedback",
    title: "Send Feedback",
    description: "Let us know how we can improve.",
    icon: MessageSquarePlus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      window.open("/feedback", "_blank")
    },
  },
  {
    id: "text",
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: Text,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run()
    },
  },
  {
    id: "todo",
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: CheckSquare,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    id: "heading1",
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: Heading1,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run()
    },
  },
  {
    id: "heading2",
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: Heading2,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run()
    },
  },
  {
    id: "heading3",
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: Heading3,
    command: ({ editor, range }) => {
      console.log("Heading 3 command")
      console.log(editor)
      console.log(range)
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run()
    },
  },
  {
    id: "bulletList",
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    id: "orderedList",
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    id: "quote",
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: TextQuote,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run()
    },
  },
  {
    id: "code",
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: Code,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    id: "image",
    title: "Image",
    description: "Upload an image from your computer.",
    searchTerms: ["photo", "picture", "media"],
    icon: Image,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0]
          const pos = editor.view.state.selection.from
          startImageUpload(file, editor.view, pos)
        }
      }
      input.click()
    },
  },
]

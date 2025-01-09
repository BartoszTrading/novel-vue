import { Editor, Range, Extension } from "@tiptap/core";
import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import Suggestion from "@tiptap/suggestion";

import SlashCommandList from "./slashCommandList.vue";
import { ALL_SLASH_COMMANDS } from "./slashExtension.items";
import { getAllowedIdsFromToggles } from "./slashExtension.types";
// import Magic from "../icons/magic.vue";

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      allowedIds: [] as string[],
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});



export interface SuggestionItem {
  title: string;
  description: string;
  icon: any;
}


const renderItems = () => {
  let component: VueRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new VueRenderer(SlashCommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      return component?.ref?.onKeyDown(props.event);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

export function buildSlashItems({
  query = "",
  allowedIds,
}: {
  query?: string;
  allowedIds: string[];
}) {

  let items = ALL_SLASH_COMMANDS

  if (allowedIds && allowedIds.length) {
    items = items.filter((item) => allowedIds.includes(item.id))
  }

  // 2) Filter by query (ignore if the user hasn't typed anything yet)
  if (query.trim().length > 0) {
    const lower = query.trim().toLowerCase()
    items = items.filter((item) => {
      return (
        item.title.toLowerCase().includes(lower) ||
        (item.description && item.description.toLowerCase().includes(lower)) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) =>
            term.toLowerCase().includes(lower),
          ))
      )
    })
  } else {
    return items
  }
}

const SlashCommand = Command.configure({
  /**
   * Example usage:
   *   toggles: { feedback: false, heading1: true, heading2: false }
   */
  toggles: {},

  suggestion: {
    // Provide the items function
    items: function ({ query }: { query: string }) {
      // Convert toggles to allowedIds
      const allowedIds = getAllowedIdsFromToggles(this?.toggles)
      // Then build items using your existing logic
      return buildSlashItems({
        query,
        allowedIds,
      })
    },
    render: renderItems,
  },
})

export default SlashCommand

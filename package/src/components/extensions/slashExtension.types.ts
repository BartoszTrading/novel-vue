import { ALL_SLASH_COMMANDS } from "./slashExtension.items"

export type SlashCommandId =
  | "continueWriting"
  | "feedback"
  | "text"
  | "todo"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "orderedList"
  | "quote"
  | "code"
  | "image"

function getMergedToggles(userToggles?: SlashCommandToggles): Record<SlashCommandId, boolean> {
  // Build a default object with everything = true
  const defaults = ALL_SLASH_COMMANDS.reduce<Record<SlashCommandId, boolean>>((acc, cmd) => {
    acc[cmd.id as SlashCommandId] = true
    return acc
  }, {} as Record<SlashCommandId, boolean>)

  // Overwrite defaults with user-specified toggles
  const finalToggles: Record<SlashCommandId, boolean> = {
    ...defaults,
    ...(userToggles ?? {}),
  }

  return finalToggles
}
export function getAllowedIdsFromToggles(toggles?: SlashCommandToggles): SlashCommandId[] {
  const merged = getMergedToggles(toggles)
  return (Object.entries(merged) as [SlashCommandId, boolean][])
    .filter(([_, isEnabled]) => isEnabled)
    .map(([id]) => id)
}
export interface SlashCommandToggles extends Partial<Record<SlashCommandId, boolean>> { }
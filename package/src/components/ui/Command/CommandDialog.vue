<template>
  <Transition appear>
    <Dialog v-if="modelValue" as="div" class="fixed inset-0 z-50" @close="onClose">
      <!-- Backdrop / Overlay -->
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>

      <!-- Dialog Panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel class="dialog-content overflow-hidden p-0 shadow-lg">
            <Command
              className="
                [&_[cmdk-group-heading]]:px-2
                [&_[cmdk-group-heading]]:font-medium
                [&_[cmdk-group-heading]]:text-muted-foreground
                [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0
                [&_[cmdk-group]]:px-2
                [&_[cmdk-input-wrapper]_svg]:h-5
                [&_[cmdk-input-wrapper]_svg]:w-5
                [&_[cmdk-input]]:h-12
                [&_[cmdk-item]]:px-2
                [&_[cmdk-item]]:py-3
                [&_[cmdk-item]_svg]:h-5
                [&_[cmdk-item]_svg]:w-5
              "
            >
              <slot />
            </Command>
          </Dialog.Panel>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>
</template>

<script setup lang="ts">
import Command from "./Command.vue";
import { Dialog, TransitionChild } from "@headlessui/vue";

 defineProps<{
  modelValue: boolean;
}>();
const emits = defineEmits(["update:modelValue"]);

function onClose() {
  emits("update:modelValue", false);
}
</script>

<style scoped>
.dialog-content {
  @apply bg-white dark:bg-neutral-800 rounded-md;
  /* Mimic your original .shadow-lg or use custom styling */
}
</style>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: 'lg',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close']);

watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
);

const close = () => {
  if (props.closeable) {
    emit('close');
  }
};

const closeOnEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', closeOnEscape);
  if (props.show) {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
  document.body.style.overflow = '';
});

const maxWidthClass = computed(() => {
  return {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[props.maxWidth] ?? 'sm:max-w-lg';
});
</script>

<template>
  <teleport to="body">
    <transition leave-active-class="duration-200">
      <div
        v-show="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-modal-title"
      >
        <!-- Backdrop transition -->
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-show="show"
            class="fixed inset-0 transform transition-all"
            @click="close"
          >
            <div class="absolute inset-0 bg-gray-600/75 dark:bg-black/80 backdrop-blur-sm" />
          </div>
        </transition>

        <!-- Centering container (both horizontal and vertical) -->
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
          @click.self="close"
        >
          <transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-show="show"
              :class="maxWidthClass"
              class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <!-- Close icon button -->
              <button
                v-if="closeable"
                type="button"
                class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                @click="close"
                aria-label="Close"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>

              <div class="px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <InformationCircleIcon class="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      id="notice-modal-title"
                      class="text-lg font-bold leading-6 text-red-600 dark:text-red-400"
                    >
                      IMPORTANT !!!
                    </h3>
                    <div class="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        This is a backup cloned from
                        <a
                          href="https://github.com/docchula/el-player"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          docchula/el-player
                        </a>.
                      </p>
                      <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white py-0.5">
                        Please visit
                        <a
                          href="https://player.docchula.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 break-all"
                        >
                          https://player.docchula.com/
                        </a>
                        first!
                      </p>
                      <p>
                        This site is intended for <strong>backup use only</strong>.
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        All credits and original work belong to the Docchula team. For inquiries or more information, please contact
                        <a
                          href="mailto:it.division@docchula.com"
                          class="font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          it.division@docchula.com
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="bg-gray-50 dark:bg-gray-800/80 px-6 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100 dark:border-gray-700/60"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:ml-3 sm:w-auto transition-colors duration-150"
                  @click="close"
                >
                  Understood
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

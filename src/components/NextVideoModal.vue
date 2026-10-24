<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  ArrowRightIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  countdownDuration: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['cancel', 'confirm']);

const countdown = ref(props.countdownDuration);
let timer: ReturnType<typeof setInterval> | null = null;

const clearCountdownTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const startCountdown = () => {
  clearCountdownTimer();
  countdown.value = props.countdownDuration;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearCountdownTimer();
      emit('confirm');
    }
  }, 1000);
};

watch(
  () => props.show,
  newShow => {
    if (newShow) {
      document.body.style.overflow = 'hidden';
      startCountdown();
    } else {
      document.body.style.overflow = '';
      clearCountdownTimer();
    }
  },
  { immediate: true },
);

const cancel = () => {
  clearCountdownTimer();
  emit('cancel');
};

const confirm = () => {
  clearCountdownTimer();
  emit('confirm');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    cancel();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  if (props.show) {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
  clearCountdownTimer();
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
        aria-labelledby="next-video-modal-title"
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
            @click="cancel"
          >
            <div
              class="absolute inset-0 bg-gray-600/75 backdrop-blur-sm dark:bg-black/80"
            />
          </div>
        </transition>

        <!-- Centering container -->
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
          @click.self="cancel"
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
              class="relative transform overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md dark:border-gray-700 dark:bg-gray-800"
            >
              <!-- Close icon button -->
              <button
                type="button"
                class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close"
                @click="cancel"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>

              <div class="px-6 pb-4 pt-6 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <!-- Sparkles Badge Icon -->
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 sm:mx-0 sm:h-10 sm:w-10 dark:bg-primary-900/50 dark:text-primary-400"
                  >
                    <SparklesIcon class="h-6 w-6" aria-hidden="true" />
                  </div>

                  <div
                    class="mt-3 flex-1 text-center sm:ml-4 sm:mt-0 sm:text-left"
                  >
                    <h3
                      id="next-video-modal-title"
                      class="text-lg font-bold leading-6 text-gray-900 dark:text-white"
                    >
                      Your video has ended
                    </h3>

                    <div
                      class="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <p class="font-medium text-primary-600 dark:text-primary-400">
                        Something interesting is coming up...
                      </p>

                      <!-- Countdown Circle / Display -->
                      <div class="my-4 flex flex-col items-center justify-center py-2">
                        <div
                          class="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-primary-50 text-2xl font-black text-primary-600 ring-4 ring-primary-100 dark:bg-primary-950/60 dark:text-primary-400 dark:ring-primary-900/60"
                        >
                          {{ countdown }}
                        </div>
                        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Playing next in {{ countdown }} second{{
                            countdown === 1 ? '' : 's'
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div
                class="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3 sm:flex-row sm:justify-end sm:px-6 dark:border-gray-700/60 dark:bg-gray-800/80"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none sm:w-auto dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  @click="cancel"
                >
                  Remain in video
                </button>
                <button
                  type="button"
                  class="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:w-auto"
                  @click="confirm"
                >
                  <span>Go Now</span>
                  <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

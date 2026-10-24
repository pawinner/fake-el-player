<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

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
  isOpen: {
    type: Boolean,
    default: true,
  },
  redirectUrl: {
    type: String,
    default: 'https://player.docchula.com/',
  },
});

const emit = defineEmits(['close']);

const isModalCloseable = computed(() => {
  return props.isOpen && props.closeable;
});

const countdown = ref(3);
let timer: ReturnType<typeof setInterval> | null = null;

const computedRedirectUrl = computed(() => {
  if (typeof window !== 'undefined' && window.location.search) {
    const base = props.redirectUrl;
    return base.endsWith('/')
      ? `${base}${window.location.search}`
      : `${base}/${window.location.search}`;
  }
  return props.redirectUrl;
});

const handleManualRedirect = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const executeRedirect = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (typeof window !== 'undefined') {
    window.location.href = computedRedirectUrl.value;
  }
};

const startCountdown = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  countdown.value = 3;
  timer = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--;
    } else {
      countdown.value = 0;
      executeRedirect();
    }
  }, 1000);
};

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

watch(
  () => [props.show, props.isOpen],
  ([show, isOpen]) => {
    if (show && !isOpen) {
      startCountdown();
    } else {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  },
  { immediate: true },
);

const close = () => {
  if (isModalCloseable.value) {
    emit('close');
  }
};

const closeOnEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show && isModalCloseable.value) {
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
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

const maxWidthClass = computed(() => {
  return (
    {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
    }[props.maxWidth] ?? 'sm:max-w-lg'
  );
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
            <div
              class="absolute inset-0 bg-gray-600/75 backdrop-blur-sm dark:bg-black/80"
            />
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
              class="relative transform overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full dark:border-gray-700 dark:bg-gray-800"
            >
              <!-- Close icon button (only visible when closeable) -->
              <button
                v-if="isModalCloseable"
                type="button"
                class="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300"
                @click="close"
                aria-label="Close"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>

              <div class="px-6 pb-4 pt-6 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <!-- TRUE icon: Warning red -->
                  <div
                    v-if="isOpen"
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900/40 dark:text-red-400"
                  >
                    <InformationCircleIcon
                      class="h-6 w-6 text-red-600 dark:text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <!-- FALSE icon: Success emerald -->
                  <div
                    v-else
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:mx-0 sm:h-10 sm:w-10 dark:bg-emerald-900/40 dark:text-emerald-400"
                  >
                    <CheckCircleIcon
                      class="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    class="mt-3 flex-1 text-center sm:ml-4 sm:mt-0 sm:text-left"
                  >
                    <h3
                      id="notice-modal-title"
                      :class="
                        isOpen
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      "
                      class="text-lg font-bold leading-6"
                    >
                      {{
                        isOpen
                          ? 'ATTENTION !!!'
                          : 'player.docchula.com is Back Online!'
                      }}
                    </h3>

                    <!-- TRUE: Standard backup notice -->
                    <div
                      v-if="isOpen"
                      class="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <p>
                        This site is intended for
                        <strong>backup use only</strong>.
                      </p>
                      <p
                        class="py-0.5 text-base font-bold text-gray-900 sm:text-lg dark:text-white"
                      >
                        Please visit
                        <a
                          href="https://player.docchula.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="break-all text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          https://player.docchula.com/
                        </a>
                        first!
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        This is a clone of
                        <a
                          href="https://github.com/docchula/el-player"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          docchula/el-player
                        </a>.
                        All credits and original work belong to the original developer.
                        For more information, please contact
                        <a
                          href="mailto:itdivision@docchula.com"
                          class="font-medium text-primary-600 underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          itdivision@docchula.com
                        </a>.
                      </p>
                    </div>

                    <!-- FALSE: Actual server back online & redirect notice -->
                    <div
                      v-else
                      class="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <p>
                        This backup website is closed. You will be redirected to
                        it in:
                      </p>

                      <!-- Countdown visual (3.. 2.. 1..) -->
                      <div
                        class="my-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-700/40"
                      >
                        <div
                          class="flex items-center justify-center space-x-3 text-3xl font-black"
                        >
                          <span
                            class="transition-all duration-300"
                            :class="
                              countdown === 3
                                ? 'scale-125 font-black text-primary-600 dark:text-primary-400'
                                : 'text-gray-300 dark:text-gray-600'
                            "
                            >3..</span
                          >
                          <span
                            class="transition-all duration-300"
                            :class="
                              countdown === 2
                                ? 'scale-125 font-black text-primary-600 dark:text-primary-400'
                                : 'text-gray-300 dark:text-gray-600'
                            "
                            >2..</span
                          >
                          <span
                            class="transition-all duration-300"
                            :class="
                              countdown === 1
                                ? 'scale-125 font-black text-primary-600 dark:text-primary-400'
                                : 'text-gray-300 dark:text-gray-600'
                            "
                            >1..</span
                          >
                        </div>
                        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span v-if="countdown > 0"
                            >Redirecting in {{ countdown }}...</span
                          >
                          <span v-else>Redirecting now...</span>
                        </p>
                      </div>

                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        If you are not redirected automatically, or would like to
                        go there immediately, please click the button below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TRUE: Understood button allows user to dismiss and use backup site -->
              <div
                v-if="isOpen"
                class="border-t border-gray-100 bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:border-gray-700/60 dark:bg-gray-800/80"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:ml-3 sm:w-auto"
                  @click="close"
                >
                  Understood
                </button>
              </div>

              <!-- FALSE: NO Understood button (user cannot use this site). Direct link button to player.docchula.com -->
              <div
                v-else
                class="border-t border-gray-100 bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:border-gray-700/60 dark:bg-gray-800/80"
              >
                <a
                  :href="computedRedirectUrl"
                  class="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto dark:bg-emerald-500 dark:hover:bg-emerald-400"
                  @click="handleManualRedirect"
                >
                  <span>Go to player.docchula.com now</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

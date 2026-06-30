import type { Ref } from "vue";

/** Shows compact TopNav when the sentinel leaves the viewport. */
export function useTopNavScroll(sentinelRef: Ref<HTMLElement | null>) {
  const isCompact = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!import.meta.client) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        isCompact.value = !entry?.isIntersecting;
      },
      { threshold: 0, rootMargin: "0px" },
    );

    watch(
      sentinelRef,
      (element) => {
        observer?.disconnect();
        if (element) observer?.observe(element);
      },
      { immediate: true },
    );
  });

  onUnmounted(() => {
    observer?.disconnect();
    observer = null;
  });

  return { isCompact };
}

// Composable pour optimiser les listes avec virtualisation
import { computed, ref, watch } from 'vue'

export interface VirtualListOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualList<T>(
  items: T[],
  options: VirtualListOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options
  
  const scrollTop = ref(0)
  const containerRef = ref<HTMLElement>()

  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const totalHeight = computed(() => items.length * itemHeight)
  
  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / itemHeight)
    return Math.max(0, index - overscan)
  })
  
  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount + overscan * 2
    return Math.min(items.length - 1, index)
  })
  
  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value + 1).map((item, index) => ({
      item,
      index: startIndex.value + index,
      top: (startIndex.value + index) * itemHeight
    }))
  })

  const onScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  return {
    containerRef,
    visibleItems,
    totalHeight,
    onScroll,
    scrollTo: (index: number) => {
      if (containerRef.value) {
        containerRef.value.scrollTop = index * itemHeight
      }
    }
  }
}

// Composable pour lazy loading d'images
export function useLazyImage() {
  const imageRef = ref<HTMLImageElement>()
  const isLoaded = ref(false)
  const isError = ref(false)

  const loadImage = (src: string) => {
    if (!imageRef.value) return

    const img = new Image()
    img.onload = () => {
      if (imageRef.value) {
        imageRef.value.src = src
        isLoaded.value = true
      }
    }
    img.onerror = () => {
      isError.value = true
    }
    img.src = src
  }

  return {
    imageRef,
    isLoaded,
    isError,
    loadImage
  }
}

// Composable pour débouncer les recherches
export function useDebounce<T>(value: T, delay: number) {
  const debouncedValue = ref(value)
  
  watch(
    () => value,
    (newValue) => {
      const timeout = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
      
      return () => clearTimeout(timeout)
    },
    { immediate: true }
  )
  
  return debouncedValue
}

// Composable pour intersection observer (lazy loading)
export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  const target = ref<Element>()
  const observer = ref<IntersectionObserver>()

  const start = () => {
    if (target.value && !observer.value) {
      observer.value = new IntersectionObserver(callback, options)
      observer.value.observe(target.value)
    }
  }

  const stop = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = undefined
    }
  }

  return {
    target,
    start,
    stop
  }
}

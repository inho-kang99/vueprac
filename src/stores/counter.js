import { ref } from 'vue'
// computed = useMemo
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const message = ref([])
  const AddMessage = (newMessage) => {
    message.value = newMessage
  }

  return { message, AddMessage }
})

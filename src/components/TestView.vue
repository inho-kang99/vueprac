<script>
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    // eslint-disable-next-line no-unused-vars
    const { message, AddMessage } = useCounterStore()
    console.log(message)

    const docRef = doc(db, 'vue', `test`)
    const unsubscribe = onSnapshot(docRef, async (querySnapshot) => {
      if (querySnapshot.exists()) {
        // const {} = querySnapshot.data()
      } else {
        try {
          await setDoc(docRef, {
            message: [],
            board: []
          }) // 초기 데이터 설정
        } catch (e) {
          console.error('Error creating document: ', e)
        }
      }
    })

    return { unsubscribe }
  },
  mounted() {
    console.log('연결')
  },
  unmounted() {
    console.log('연결 끊김')
    this.unsubscribe()
  }
}
</script>

<template>
  <span>test</span>
</template>

<style></style>

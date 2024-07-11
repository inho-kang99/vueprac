<script setup>
import { arrayUnion, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCounterStore } from '../stores/counter'
import { onUnmounted, onMounted, ref } from 'vue'
import {
  BoardCell,
  BoardStone,
  BoardWrap,
  ClearButton,
  MessageContainer,
  MessageInput,
  MessageInputBox,
  MessageWrap,
  NickInput,
  Wrap
} from '@/styled/MessageStyled'

const store = useCounterStore()
const docRef = doc(db, 'vue', 'test')
const setupSubscription = () => {
  const unsubscribe = onSnapshot(docRef, async (querySnapshot) => {
    if (querySnapshot.exists()) {
      const data = querySnapshot.data()
      store.AddMessage(data.message)
      store.updateBoard(data.board)
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

  return unsubscribe
}

let unsubscribe = null

const text = ref('')
const name = ref('')
const SendMessage = async (e) => {
  if (e.code === 'Enter' && text.value && name.value) {
    const docRef = doc(db, 'vue', 'test')
    const messageItem = { text: text.value, name: name.value }
    await updateDoc(docRef, {
      message: arrayUnion(messageItem)
    })
    text.value = ''
  }
}

const ClearChat = () => {
  const docRef = doc(db, 'vue', 'test')
  updateDoc(docRef, {
    message: []
  })
}
const ClearBoard = () => {
  const docRef = doc(db, 'vue', 'test')
  updateDoc(docRef, {
    board: []
  })
}

const stoneObj = {
  B: '#000',
  W: '#fff'
}

const SetStone = (location) => {
  const docRef = doc(db, 'vue', 'test')
  const lastStone = store.boardArr[store.boardArr.length - 1]
  updateDoc(docRef, {
    board: arrayUnion({
      location,
      side: lastStone?.side === 'B' ? 'W' : 'B',
      order: store.boardArr.length + 1
    })
  })
}

onMounted(() => {
  unsubscribe = setupSubscription()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
console.log(store.win)
</script>

<template>
  <Wrap>
    <MessageWrap>
      <MessageContainer v-if="store.message.length">
        <div class="message" v-for="(msg, index) in store.message" :key="index">
          <div class="text">
            <span>{{ msg.name }}: {{ msg.text }}</span>
          </div>
        </div>
      </MessageContainer>

      <MessageContainer v-else>메세지가 없습니다</MessageContainer>

      <MessageInputBox>
        <MessageInput v-model="text" @keydown="SendMessage" placeholder="메세지를 입력해주세요" />
        <NickInput @keydown="SendMessage" v-model="name" placeholder="이름" />
      </MessageInputBox>
    </MessageWrap>

    <BoardWrap>
      <BoardCell
        v-for="(item, index) in store.keys"
        v-bind:key="item & index"
        @click="SetStone(item)"
      >
        <BoardStone
          v-if="store.boardCells[item]"
          :color="`${stoneObj[store.boardCells[item].side]}`"
        />
      </BoardCell>
    </BoardWrap>
    <ClearButton @click="ClearChat">채팅 삭제</ClearButton>
    <ClearButton @click="ClearBoard">초기화</ClearButton>
  </Wrap>
</template>

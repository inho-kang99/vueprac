<script setup>
import { arrayUnion, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCounterStore } from '../stores/counter'
import { onUnmounted, onMounted, ref, computed } from 'vue'
import {
  BoardCell,
  BoardStone,
  BoardWrap,
  ClearButton,
  CoverWrap,
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
  if (!store.boardCells[location]) {
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
}

onMounted(() => {
  unsubscribe = setupSubscription()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const winSide = computed(() => {
  const checkCells = {}
  const board = store.$state.boardCells
  const filter = store.keys.filter((i) => board[i])

  filter.forEach((i) => {
    checkCells[i] = {
      R: false,
      B: false,
      RB: false,
      RT: false
    }
  })

  for (let i = 0; i < filter.length; i++) {
    const cell = board[filter[i]]
    let RArr = [cell.location]
    let BArr = [cell.location]
    let RBArr = [cell.location]
    let RTArr = [cell.location]
    if (cell) {
      // 가로
      const side = cell?.side
      let count = 1
      let [cellRow, cellColumn] = cell.location.split('x')
      let row = Number(cellRow)
      let column = Number(cellColumn) + 1
      if (!checkCells[cell?.location].R) {
        while (board[`${row}x${Number(column)}`]) {
          const rightCell = board[`${row}x${Number(column)}`]
          if (rightCell?.side === side) {
            RArr.push(`${row}x${Number(column)}`)
            count += 1
            column += 1
          } else {
            break
          }
        }
        if (count > 5) {
          RArr.forEach((j) => {
            checkCells[j].R = true
          })
        }
        if (count === 5) {
          return side
        }
      }
      // 세로
      if (!checkCells[cell?.location].B) {
        row = Number(cellRow) + 1
        column = Number(cellColumn)
        count = 1
        while (board[`${row}x${Number(column)}`]) {
          const rightCell = board[`${Number(row)}x${Number(column)}`]
          if (rightCell?.side === side) {
            BArr.push(`${row}x${Number(column)}`)
            count += 1
            row += 1
          } else {
            break
          }
        }
        if (count > 5) {
          BArr.forEach((j) => {
            checkCells[j].B = true
          })
        }
        if (count === 5) {
          return side
        }
      }

      // 우하향 대각선
      if (!checkCells[cell?.location].RB) {
        row = Number(cellRow) + 1
        column = Number(cellColumn) + 1
        count = 1
        while (board[`${row}x${Number(column)}`]) {
          const rightCell = board[`${Number(row)}x${Number(column)}`]
          if (rightCell?.side === side) {
            RBArr.push(`${row}x${Number(column)}`)
            count += 1
            row += 1
            column += 1
          } else {
            break
          }
        }
        if (count > 5) {
          RBArr.forEach((j) => {
            checkCells[j].RB = true
          })
        }
        if (count === 5) {
          return side
        }
      }
      // 좌하향 대각선
      if (!checkCells[cell?.location].RT) {
        row = Number(cellRow) + 1
        column = Number(cellColumn) - 1
        count = 1
        while (board[`${row}x${Number(column)}`]) {
          const rightCell = board[`${Number(row)}x${Number(column)}`]
          if (rightCell?.side === side) {
            RTArr.push(`${row}x${Number(column)}`)
            count += 1
            row += 1
            column -= 1
          } else {
            break
          }
        }
        if (count > 5) {
          RTArr.forEach((j) => {
            checkCells[j].RT = true
          })
        }
        if (count === 5) {
          return side
        }
      }
    }
  }

  return null
})
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
      <CoverWrap v-if="winSide">
        <ClearButton @click="ClearBoard">초기화</ClearButton>
      </CoverWrap>
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

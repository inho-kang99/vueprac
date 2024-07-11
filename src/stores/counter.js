import { defineStore } from 'pinia'
import { boardObj } from '@/common/CommonBoard'
// import { reactive, ref } from 'vue'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      message: [],
      board: boardObj,
      keys: Object.keys(boardObj),
      boardArr: [],
      boardCells: {}
    }
  },
  getters: {
    win: (state) => {
      console.log(state.boardCells)
      const checkCells = {}

      const filter = state.keys.filter((i) => state.board[i])

      filter.forEach((i) => {
        checkCells[i] = {
          R: false,
          B: false,
          RB: false,
          RT: false
        }
      })
      return state.boardCells
    }
  },
  actions: {
    AddMessage(newMessage) {
      this.message = newMessage
    },
    updateBoard(newBoard) {
      this.boardArr = newBoard
      let obj = {}
      for (let i = 0; i < this.keys.length; i++) {
        obj[location] = null
      }
      for (let i = 0; i < newBoard.length; i++) {
        const stone = newBoard[i]
        obj[stone.location] = stone
      }
      this.boardCells = obj
    }
  }
})

import styled from 'vue3-styled-components'

export const Wrap = styled('div')`
  width: 1200px;
  height: 500px;
  display: flex;
`

export const MessageWrap = styled('div')`
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  color: white;
  gap: 5px;
  border: 1px solid #fff;
  box-sizing: border-box;
  padding: 10px;
`

export const MessageContainer = styled('div')`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
  box-sizing: border-box;
`

export const MessageInputBox = styled('div')`
  width: 100%;
  display: flex;
  gap: 5px;
  color: white;
  box-sizing: border-box;
`

export const MessageInput = styled.input`
  width: 80%;
  padding: 0 5px;
`

export const NickInput = styled.input`
  width: 20%;
  padding: 0 5px;
`

export const ClearButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 10px;
  cursor: pointer;
`

export const BoardWrap = styled('div')`
  width: 500px;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
`
export const BoardCell = styled('div')`
  width: 5%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-sizing: border-box; */
  cursor: pointer;
  border: 1px solid #fff;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`

export const BoardStone = styled('div')`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 1px solid #fff;
  /* background-color: #fff; */
  background-color: ${({ color }) => color};
`

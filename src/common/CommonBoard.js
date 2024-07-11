const boardObj = {}

for (let i = 1; i <= 20 * 20; i++) {
  const row = Math.ceil(i / 20)
  const column = i % 20 || 20
  boardObj[`${row}x${column}`] = null
}

export { boardObj }

// {location :"1x1", order:1, side:"B" }

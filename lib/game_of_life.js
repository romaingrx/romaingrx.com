export const getNeighbors = (x, y, field) => {
  let prevX = x - 1;
  if (prevX < 0) {
    prevX = field[0].length - 1;
  }

  let nextX = x + 1;
  if (nextX === field[0].length) {
    nextX = 0;
  }

  let prevY = y - 1;
  if (prevY < 0) {
    prevY = field.length - 1;
  }

  let nextY = y + 1;
  if (nextY === field.length) {
    nextY = 0;
  }

  return [
    field[prevY][prevX],
    field[prevY][x],
    field[prevY][nextX],
    field[y][prevX],
    // field[y][x], That's the cell itself - we don't need this.
    field[y][nextX],
    field[nextY][prevX],
    field[nextY][x],
    field[nextY][nextX],
  ];
};

export const getDeadOrAlive = (x, y, field) => {
  const neighbors = getNeighbors(x, y, field);
  const numberOfAliveNeighbors = neighbors.filter(Boolean).length;

  // Cell is alive
  if (field[y][x]) {
    if (numberOfAliveNeighbors < 2 || numberOfAliveNeighbors > 3) {
      // Cell dies
      return false;
    }

    // Cell stays alive
    return true;
  }

  // Cell is dead
  if (numberOfAliveNeighbors === 3) {
    // Cell becomes alive
    return true;
  }

  // Cell stays dead
  return false;
};

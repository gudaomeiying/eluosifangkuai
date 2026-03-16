import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOES,
  TETROMINO_KEYS,
  LINE_SCORES,
} from './constants';

// 创建空棋盘
export const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill({ filled: false, color: null })
  );

// 随机生成方块
export const randomTetromino = () => {
  const key = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  return { ...TETROMINOES[key], type: key };
};

// 顺时针旋转矩阵
export const rotateMatrix = (matrix) => {
  const n = matrix.length;
  return matrix[0].map((_, colIndex) =>
    matrix.map((row) => row[colIndex]).reverse()
  );
};

// 检查是否合法（碰撞检测）
export const isValidPosition = (board, shape, pos) => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;
      const newRow = pos.y + row;
      const newCol = pos.x + col;
      if (
        newCol < 0 ||
        newCol >= BOARD_WIDTH ||
        newRow >= BOARD_HEIGHT ||
        (newRow >= 0 && board[newRow][newCol].filled)
      ) {
        return false;
      }
    }
  }
  return true;
};

// 将当前方块合并到棋盘
export const mergePieceToBoard = (board, piece, pos) => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  piece.shape.forEach((row, rowIndex) => {
    row.forEach((val, colIndex) => {
      if (val) {
        const y = pos.y + rowIndex;
        const x = pos.x + colIndex;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          newBoard[y][x] = { filled: true, color: piece.color };
        }
      }
    });
  });
  return newBoard;
};

// 消除满行，返回新棋盘和消行数
export const clearLines = (board) => {
  const newBoard = board.filter((row) => row.some((cell) => !cell.filled));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array(BOARD_WIDTH).fill({ filled: false, color: null })
  );
  return { newBoard: [...emptyRows, ...newBoard], linesCleared };
};

// 计算分数
export const calcScore = (linesCleared, level) => {
  return LINE_SCORES[linesCleared] * (level + 1);
};

// 计算等级
export const calcLevel = (totalLines) => Math.min(Math.floor(totalLines / 10), 10);

// 计算幽灵方块位置（硬降落预览）
export const getGhostPosition = (board, shape, pos) => {
  let ghostY = pos.y;
  while (isValidPosition(board, shape, { x: pos.x, y: ghostY + 1 })) {
    ghostY++;
  }
  return { x: pos.x, y: ghostY };
};

// 获取初始出生位置
export const getSpawnPosition = (shape) => ({
  x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
  y: -1,
});

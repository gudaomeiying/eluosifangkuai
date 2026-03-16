// 游戏尺寸
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 32;

// 方块颜色
export const COLORS = {
  I: '#00CFCF', // 青色
  O: '#F7D308', // 黄色
  T: '#AD00FF', // 紫色
  S: '#00CC00', // 绿色
  Z: '#FF0000', // 红色
  J: '#0000FF', // 蓝色
  L: '#FF7F00', // 橙色
  GHOST: 'rgba(255,255,255,0.15)',
  EMPTY: 'transparent',
};

// 七种俄罗斯方块形状
export const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: COLORS.I,
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: COLORS.O,
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.T,
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: COLORS.S,
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.Z,
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.J,
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.L,
  },
};

export const TETROMINO_KEYS = Object.keys(TETROMINOES);

// 等级速度（毫秒）
export const LEVEL_SPEEDS = [
  800, 720, 630, 550, 470, 380, 300, 220, 130, 100, 80,
];

// 消行得分
export const LINE_SCORES = [0, 100, 300, 500, 800];

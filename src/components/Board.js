import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, COLORS } from '../constants';

const Board = ({ board, currentPiece, currentPos, ghostPos }) => {
  // 构建渲染用的棋盘（叠加当前方块和幽灵方块）
  const renderBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  // 绘制幽灵方块
  if (currentPiece && ghostPos) {
    currentPiece.shape.forEach((row, rowIdx) => {
      row.forEach((val, colIdx) => {
        if (val) {
          const y = ghostPos.y + rowIdx;
          const x = ghostPos.x + colIdx;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            if (!renderBoard[y][x].filled) {
              renderBoard[y][x] = { filled: false, color: COLORS.GHOST, isGhost: true };
            }
          }
        }
      });
    });
  }

  // 绘制当前方块
  if (currentPiece && currentPos) {
    currentPiece.shape.forEach((row, rowIdx) => {
      row.forEach((val, colIdx) => {
        if (val) {
          const y = currentPos.y + rowIdx;
          const x = currentPos.x + colIdx;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            renderBoard[y][x] = { filled: true, color: currentPiece.color };
          }
        }
      });
    });
  }

  return (
    <View style={styles.board}>
      {renderBoard.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((cell, colIdx) => (
            <View
              key={colIdx}
              style={[
                styles.cell,
                cell.filled
                  ? [styles.filledCell, { backgroundColor: cell.color }]
                  : cell.isGhost
                  ? styles.ghostCell
                  : styles.emptyCell,
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#00CFCF',
    backgroundColor: '#0A0A1A',
    shadowColor: '#00CFCF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  filledCell: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    // 立体感
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  ghostCell: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
});

export default Board;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';

import Board from '../components/Board';
import NextPiece from '../components/NextPiece';
import ScoreBoard from '../components/ScoreBoard';
import Controls from '../components/Controls';

import {
  createEmptyBoard,
  randomTetromino,
  rotateMatrix,
  isValidPosition,
  mergePieceToBoard,
  clearLines,
  calcScore,
  calcLevel,
  getGhostPosition,
  getSpawnPosition,
} from '../gameLogic';

import { LEVEL_SPEEDS } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GAME_STATES = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

const GameScreen = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);

  // refs 用于在定时器中访问最新状态
  const boardRef = useRef(board);
  const currentPieceRef = useRef(currentPiece);
  const currentPosRef = useRef(currentPos);
  const gameStateRef = useRef(gameState);
  const levelRef = useRef(level);
  const scoreRef = useRef(score);
  const linesRef = useRef(lines);
  const nextPieceRef = useRef(nextPiece);

  boardRef.current = board;
  currentPieceRef.current = currentPiece;
  currentPosRef.current = currentPos;
  gameStateRef.current = gameState;
  levelRef.current = level;
  scoreRef.current = score;
  linesRef.current = lines;
  nextPieceRef.current = nextPiece;

  const dropTimerRef = useRef(null);

  // 生成新方块并放置在顶部
  const spawnNewPiece = useCallback((boardSnapshot, next) => {
    const piece = next || randomTetromino();
    const nextNext = randomTetromino();
    const pos = getSpawnPosition(piece.shape);

    if (!isValidPosition(boardSnapshot, piece.shape, pos)) {
      // 游戏结束
      setGameState(GAME_STATES.GAME_OVER);
      return false;
    }

    setCurrentPiece(piece);
    setCurrentPos(pos);
    setNextPiece(nextNext);
    return true;
  }, []);

  // 锁定当前方块到棋盘
  const lockPiece = useCallback(() => {
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const boardSnap = boardRef.current;
    if (!piece) return;

    const newBoard = mergePieceToBoard(boardSnap, piece, pos);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

    const newLines = linesRef.current + linesCleared;
    const newLevel = calcLevel(newLines);
    const newScore = scoreRef.current + calcScore(linesCleared, levelRef.current);

    setBoard(clearedBoard);
    setLines(newLines);
    setLevel(newLevel);
    setScore(newScore);

    // 生成下一个方块
    spawnNewPiece(clearedBoard, nextPieceRef.current);
  }, [spawnNewPiece]);

  // 方块下移一格
  const moveDown = useCallback(() => {
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const boardSnap = boardRef.current;
    if (!piece || gameStateRef.current !== GAME_STATES.PLAYING) return;

    const newPos = { ...pos, y: pos.y + 1 };
    if (isValidPosition(boardSnap, piece.shape, newPos)) {
      setCurrentPos(newPos);
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  // 重置并启动定时下落
  const startDropTimer = useCallback(() => {
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    dropTimerRef.current = setInterval(() => {
      moveDown();
    }, LEVEL_SPEEDS[levelRef.current] || 100);
  }, [moveDown]);

  // 监听等级变化调整速度
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      startDropTimer();
    }
    return () => {
      if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    };
  }, [level, gameState, startDropTimer]);

  // 开始游戏
  const startGame = useCallback(() => {
    const freshBoard = createEmptyBoard();
    const first = randomTetromino();
    const second = randomTetromino();
    const pos = getSpawnPosition(first.shape);

    setBoard(freshBoard);
    setScore(0);
    setLevel(0);
    setLines(0);
    setCurrentPiece(first);
    setCurrentPos(pos);
    setNextPiece(second);
    setGameState(GAME_STATES.PLAYING);
  }, []);

  // 暂停 / 继续
  const togglePause = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      setGameState(GAME_STATES.PAUSED);
    } else if (gameState === GAME_STATES.PAUSED) {
      setGameState(GAME_STATES.PLAYING);
    }
  }, [gameState]);

  // 向左移动
  const moveLeft = useCallback(() => {
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const boardSnap = boardRef.current;
    if (!piece || gameStateRef.current !== GAME_STATES.PLAYING) return;
    const newPos = { ...pos, x: pos.x - 1 };
    if (isValidPosition(boardSnap, piece.shape, newPos)) setCurrentPos(newPos);
  }, []);

  // 向右移动
  const moveRight = useCallback(() => {
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const boardSnap = boardRef.current;
    if (!piece || gameStateRef.current !== GAME_STATES.PLAYING) return;
    const newPos = { ...pos, x: pos.x + 1 };
    if (isValidPosition(boardSnap, piece.shape, newPos)) setCurrentPos(newPos);
  }, []);

  // 旋转
  const rotate = useCallback(() => {
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const boardSnap = boardRef.current;
    if (!piece || gameStateRef.current !== GAME_STATES.PLAYING) return;

    const rotated = rotateMatrix(piece.shape);
    // SRS 踢墙：依次尝试原位、左移、右移
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      const newPos = { ...pos, x: pos.x + kick };
      if (isValidPosition(boardSnap, rotated, newPos)) {
        setCurrentPiece({ ...piece, shape: rotated });
        setCurrentPos(newPos);
        return;
      }
    }
  }, []);

  // 硬降落
  const hardDrop = useCallback(() => {
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const boardSnap = boardRef.current;
    if (!piece || gameStateRef.current !== GAME_STATES.PLAYING) return;
    const ghost = getGhostPosition(boardSnap, piece.shape, pos);
    setCurrentPos(ghost);
    // 立即锁定
    setTimeout(() => lockPiece(), 0);
  }, [lockPiece]);

  // 触控滑动手势
  const swipeRef = useRef({ startX: 0, startY: 0, lastMoveX: 0 });
  const SWIPE_THRESHOLD = 30;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () =>
      gameStateRef.current === GAME_STATES.PLAYING,
    onMoveShouldSetPanResponder: () =>
      gameStateRef.current === GAME_STATES.PLAYING,
    onPanResponderGrant: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      swipeRef.current = { startX: pageX, startY: pageY, lastMoveX: pageX };
    },
    onPanResponderMove: (evt) => {
      const { pageX } = evt.nativeEvent;
      const deltaX = pageX - swipeRef.current.lastMoveX;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) moveRight();
        else moveLeft();
        swipeRef.current.lastMoveX = pageX;
      }
    },
    onPanResponderRelease: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      const dx = pageX - swipeRef.current.startX;
      const dy = pageY - swipeRef.current.startY;
      // 向上轻扫 => 旋转
      if (dy < -40 && Math.abs(dx) < 60) rotate();
      // 向下快划 => 硬降落
      else if (dy > 80 && Math.abs(dx) < 60) hardDrop();
    },
  });

  // 计算幽灵位置
  const ghostPos =
    currentPiece && gameState === GAME_STATES.PLAYING
      ? getGhostPosition(board, currentPiece.shape, currentPos)
      : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" />
      <View style={styles.container}>
        {/* 标题 */}
        <Text style={styles.title}>TETRIS</Text>

        <View style={styles.gameArea}>
          {/* 棋盘（支持触控手势） */}
          <View {...panResponder.panHandlers}>
            <Board
              board={board}
              currentPiece={gameState === GAME_STATES.PLAYING ? currentPiece : null}
              currentPos={currentPos}
              ghostPos={ghostPos}
            />
          </View>

          {/* 右侧信息面板 */}
          <View style={styles.sidePanel}>
            <NextPiece piece={nextPiece} />
            <View style={styles.spacer} />
            <ScoreBoard score={score} level={level} lines={lines} />
          </View>
        </View>

        {/* 操控按钮 */}
        {gameState === GAME_STATES.PLAYING && (
          <Controls
            onLeft={moveLeft}
            onRight={moveRight}
            onRotate={rotate}
            onDown={moveDown}
            onHardDrop={hardDrop}
            onPause={togglePause}
          />
        )}

        {/* 开始按钮（空闲状态） */}
        {gameState === GAME_STATES.IDLE && (
          <TouchableOpacity style={styles.startBtn} onPress={startGame}>
            <Text style={styles.startBtnText}>START GAME</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 暂停弹窗 */}
      <Modal transparent visible={gameState === GAME_STATES.PAUSED} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>PAUSED</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={togglePause}>
              <Text style={styles.modalBtnText}>RESUME</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnSecondary]}
              onPress={startGame}
            >
              <Text style={styles.modalBtnText}>RESTART</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 游戏结束弹窗 */}
      <Modal
        transparent
        visible={gameState === GAME_STATES.GAME_OVER}
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>GAME OVER</Text>
            <Text style={styles.modalScore}>SCORE: {score}</Text>
            <Text style={styles.modalScore}>LEVEL: {level + 1}</Text>
            <Text style={styles.modalScore}>LINES: {lines}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={startGame}>
              <Text style={styles.modalBtnText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050510',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  title: {
    color: '#00CFCF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: 12,
    textShadowColor: '#00CFCF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  gameArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sidePanel: {
    alignItems: 'center',
    paddingTop: 4,
    gap: 16,
  },
  spacer: {
    height: 20,
  },
  startBtn: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderColor: '#00CFCF',
    borderRadius: 8,
    backgroundColor: 'rgba(0,207,207,0.1)',
  },
  startBtnText: {
    color: '#00CFCF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#0A0A1A',
    borderWidth: 2,
    borderColor: '#00CFCF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    minWidth: 240,
  },
  modalTitle: {
    color: '#00CFCF',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 8,
  },
  modalScore: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 2,
  },
  modalBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#00CFCF',
    borderRadius: 8,
    backgroundColor: 'rgba(0,207,207,0.15)',
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSecondary: {
    borderColor: '#FF7F00',
    backgroundColor: 'rgba(255,127,0,0.1)',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default GameScreen;

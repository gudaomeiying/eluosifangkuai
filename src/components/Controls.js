import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Controls = ({ onLeft, onRight, onRotate, onDown, onHardDrop, onPause }) => {
  return (
    <View style={styles.container}>
      {/* 上方旋转 + 暂停 */}
      <View style={styles.topRow}>
        <CtrlBtn label="⟳" onPress={onRotate} size="large" color="#AD00FF" />
        <CtrlBtn label="⏸" onPress={onPause} size="medium" color="#888" />
      </View>

      {/* 方向控制 */}
      <View style={styles.dpad}>
        <CtrlBtn label="◀" onPress={onLeft} size="large" color="#00CFCF" />
        <View style={styles.dpadCenter}>
          <CtrlBtn label="▼" onPress={onDown} size="large" color="#00CFCF" />
        </View>
        <CtrlBtn label="▶" onPress={onRight} size="large" color="#00CFCF" />
      </View>

      {/* 硬降落 */}
      <View style={styles.bottomRow}>
        <CtrlBtn label="⬇ DROP" onPress={onHardDrop} wide color="#F7D308" />
      </View>
    </View>
  );
};

const CtrlBtn = ({ label, onPress, size = 'medium', color = '#00CFCF', wide = false }) => {
  const btnSize = size === 'large' ? 64 : 48;
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          width: wide ? 180 : btnSize,
          height: btnSize,
          borderColor: color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={[styles.btnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  dpad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dpadCenter: {
    alignItems: 'center',
  },
  bottomRow: {
    marginTop: 4,
  },
  btn: {
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#00CFCF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Controls;

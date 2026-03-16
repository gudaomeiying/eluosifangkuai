import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreBoard = ({ score, level, lines }) => {
  return (
    <View style={styles.container}>
      <ScoreItem label="SCORE" value={score} />
      <ScoreItem label="LEVEL" value={level + 1} />
      <ScoreItem label="LINES" value={lines} />
    </View>
  );
};

const ScoreItem = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  item: {
    backgroundColor: '#0A0A1A',
    borderWidth: 1,
    borderColor: '#00CFCF',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 90,
  },
  label: {
    color: '#00CFCF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScoreBoard;

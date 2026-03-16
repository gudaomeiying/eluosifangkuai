import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PREVIEW_SIZE = 22;

const NextPiece = ({ piece }) => {
  if (!piece) return null;

  const { shape, color } = piece;
  const rows = shape.length;
  const cols = shape[0].length;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>NEXT</Text>
      <View style={styles.previewBox}>
        {shape.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((val, colIdx) => (
              <View
                key={colIdx}
                style={[
                  styles.cell,
                  val
                    ? [styles.filled, { backgroundColor: color }]
                    : styles.empty,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    color: '#00CFCF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  previewBox: {
    backgroundColor: '#0A0A1A',
    padding: 8,
    borderWidth: 1,
    borderColor: '#00CFCF',
    borderRadius: 4,
    minWidth: 4 * PREVIEW_SIZE + 16,
    minHeight: 4 * PREVIEW_SIZE + 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    margin: 1,
  },
  filled: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  empty: {
    backgroundColor: 'transparent',
  },
});

export default NextPiece;

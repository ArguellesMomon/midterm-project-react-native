import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { padding: 15, marginVertical: 8, borderWidth: 1, borderRadius: 8, borderColor: '#ccc' },
  title: { fontWeight: 'bold', fontSize: 16 },
  company: { fontSize: 14, color: '#555' },
  salary: { fontSize: 14, color: '#888' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

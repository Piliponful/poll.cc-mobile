import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  picker: {
    marginVertical: 10,
    marginHorizontal: 15,
    height: 50,
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3eb5f1',
    width: 38,
    height: 38,
    borderRadius: 25,
  },
  addButton: {
    fontSize: 22,
  },
  pollCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  pollImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  pollContent: {
    padding: 10,
  },
  user: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  totalAnswers: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  actionsWithMargin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },

  // 💥 NEW styles for multi-option rendering:
  optionContainer: {
    marginTop: 12,
  },
  optionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  optionPercent: {
    fontSize: 14,
    color: '#888',
  },
  optionBarBackground: {
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  optionBarFill: {
    height: '100%',
    backgroundColor: '#f99a57',
    borderRadius: 6,
  },

  // Legacy (can remove if unused)
  progressBarContainer: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ff4d4d',
  },
  progressBarNo: {
    height: 6,
    backgroundColor: '#3eb5f1',
  },
  stats: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },

  // Misc
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#222',
  },
  noImagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#777',
    fontSize: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  askBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  askButton: {
    backgroundColor: '#f00',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  askText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

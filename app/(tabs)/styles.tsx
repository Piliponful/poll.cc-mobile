import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

  // Misc
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#222',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIconContainer: {
    marginLeft: 8,
  },
  bottomSheetCustom: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  
  searchInputCustom: {
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  
  findButton: {
    backgroundColor: '#999',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  
  findButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  sectionLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    marginLeft: 4,
  },
  
  dropdown: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  
  dropdownMenu: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    borderRadius: 10,
    paddingVertical: 8,
    zIndex: 1000,
  },
  
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  
  dropdownItemText: {
    color: '#fff',
    fontSize: 15,
  },
  
});

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  optionSelected: {
    // borderColor: '#6c63ff',
    // borderWidth: 2,
    // backgroundColor: 'rgba(108, 99, 255, 0.08)',
  },
  optionUserAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#121212',
  },
  pollCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e8ed',
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'relative',
    // borderBottomWidth: 1,
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
  viewVotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 8,
  },
  overlappingAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voterAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  voterAvatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewVotesText: {
    fontSize: 12,
    color: '#1da1f2',
    marginLeft: 6,
    fontWeight: '500',
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
    fontSize: 15,
    // fontWeight: 'bold',
    marginVertical: 5,
    color: '#222',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingTop: 0,
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
})

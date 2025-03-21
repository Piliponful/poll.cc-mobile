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
    backgroundColor: '#3eb5f1', // Updated color
    width: 38,
    height: 38,
    borderRadius: 25,
  },
  
  addButton: {
    fontSize: 22, // Ensures consistency with other icons
  },

  pollCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Add a 1px gray border
    shadowColor: 'transparent', // Remove shadow
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },  
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#222',
  },  
  pollImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
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
  progressBarContainer: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  
  progressBar: {
    height: 6,
    backgroundColor: '#ff4d4d', // Yes percentage (default red)
  },
  
  progressBarNo: {
    height: 6,
    backgroundColor: '#3eb5f1', // No percentage (updated to requested color)
  },
  
  stats: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  totalAnswers: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsWithMargin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25 // Adds space above the icons
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});

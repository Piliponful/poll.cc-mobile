import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import styles from './create-poll-styles'

const CreatePollScreen: React.FC = () => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '']) // Start with 2 empty options
  const router = useRouter()

  const addOption = () => {
    if (options.length < 6) {
      // Limit to 6 options
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      // Keep minimum 2 options
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options]
    newOptions[index] = text
    setOptions(newOptions)
  }

  const handleSubmit = () => {
    // Validate form
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question')
      return
    }

    const validOptions = options.filter(option => option.trim() !== '')
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please enter at least 2 options')
      return
    }

    // Here you would typically send the data to your API

    // For now, just show success and go back
    Alert.alert('Success', 'Poll created successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ])
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#121212" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Poll</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="What would you like to ask?"
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Options</Text>
            {options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TextInput
                  style={styles.optionInput}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChangeText={text => updateOption(index, text)}
                  maxLength={100}
                />
                {options.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeOption(index)}
                    style={styles.removeButton}
                  >
                    <Feather name="x" size={20} color="#ff4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {options.length < 6 && (
              <TouchableOpacity
                onPress={addOption}
                style={styles.addOptionButton}
              >
                <AntDesign name="plus" size={20} color="#3eb5f1" />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Create Poll</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreatePollScreen

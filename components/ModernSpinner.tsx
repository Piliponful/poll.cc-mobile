import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'

interface ModernSpinnerProps {
  size?: number
  color?: string
  strokeWidth?: number
}

const ModernSpinner: React.FC<ModernSpinnerProps> = ({
  size = 24,
  color = '#121212',
  strokeWidth = 2,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current
  const scaleValue = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    )

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    )

    spinAnimation.start()
    scaleAnimation.start()

    return () => {
      spinAnimation.stop()
      scaleAnimation.stop()
    }
  }, [spinValue, scaleValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const containerStyle = {
    width: size,
    height: size,
    transform: [{ rotate: spin }, { scale: scaleValue }],
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, containerStyle]}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderWidth: strokeWidth,
              borderColor: color,
            },
          ]}
        />
        <View
          style={[
            styles.progress,
            {
              width: size,
              height: size,
              borderWidth: strokeWidth,
              borderColor: color,
            },
          ]}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    position: 'relative',
  },
  circle: {
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    opacity: 0.3,
  },
  progress: {
    position: 'absolute',
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
})

export default ModernSpinner

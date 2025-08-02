export const circlePartsToCompositionType = circleParts => {
  if (circleParts.includes('intersection') && circleParts.length === 1) {
    return 'intersection'
  }
  if (circleParts.includes('leftWing') && circleParts.length === 1) {
    return 'left-subtracting-right'
  }
  if (circleParts.includes('rightWing') && circleParts.length === 1) {
    return 'right-subtracting-left'
  }
  if (
    circleParts.includes('rightWing') &&
    circleParts.includes('leftWing') &&
    circleParts.length === 2
  ) {
    return 'symmetric-difference'
  }
  if (
    ['leftWing', 'intersection', 'rightWing'].every(i =>
      circleParts.includes(i)
    )
  ) {
    return 'union'
  }

  return null
}

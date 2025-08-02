import { SET_SELECTED_FOR_COMPOSITION_GROUP_IDS } from '@/actions/selectedForCompositionGroupIds'

const initialState: string[] = []

export default (state = initialState, action: any) => {
  const { type, payload: selectedForCompositionGroupIds } = action

  const updateStateByFunctionName = {
    [SET_SELECTED_FOR_COMPOSITION_GROUP_IDS]: () =>
      selectedForCompositionGroupIds,
  }

  const actionHandler =
    updateStateByFunctionName[type as keyof typeof updateStateByFunctionName] ||
    (() => state)

  return actionHandler()
}

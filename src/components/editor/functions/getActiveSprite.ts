
import  useEditorStore  from '@/store/use-editor-store'

function getActiveSprite() {
    return useEditorStore.getState().trackItemsMap[useEditorStore.getState().activeId]
}

export default getActiveSprite

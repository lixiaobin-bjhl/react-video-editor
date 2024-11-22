import { IEditorState } from '@/interfaces/editor'
import { create } from 'zustand'


const useEditorStore = create<IEditorState>((set) => ({
    trackItemsMap: {},
    activeId: null,
    controlType: null,
    tlData: [],
    activeSprite: null,
    setTLData: (tlData) => {
        console.log('setTLData', tlData)
        set({ tlData })
    },
    setActiveSprite: (activeSprite) => set({ activeSprite }),
    setControlType: (controlType) => set({ controlType }),
    setTrackItemsMap: (trackItemsMap) => set({ trackItemsMap }),
    setActiveId: (activeId) => set({ activeId }),
}))

export default useEditorStore

import { ILayoutState } from '@/interfaces/layout'
import { create } from 'zustand'

const useLayoutStore = create<ILayoutState>((set) => ({
    activeMenuItem: null,
    controlType: '',
    showMenuItem: false,
    showControlItem: false,
    showToolboxItem: false,
    activeToolboxItem: null,
    setControlType: (controlType) => set({ controlType: controlType }),
    setActiveMenuItem: (showMenu) => set({ activeMenuItem: showMenu }),
    setShowMenuItem: (showMenuItem) => set({ showMenuItem }),
    setShowControlItem: (showControlItem) => set({ showControlItem }),
    setShowToolboxItem: (showToolboxItem) => set({ showToolboxItem }),

    displayToolbox: false,
    setDisplayToolbox: (displayToolbox) => set({ displayToolbox }),
    setActiveToolboxItem: (activeToolboxItem) => set({ activeToolboxItem }),
}))

export default useLayoutStore

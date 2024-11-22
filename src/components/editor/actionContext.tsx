// actionContext.tsx
import React, { createContext, useContext, useEffect} from 'react'
import useEditorStore  from '@/store/use-editor-store'


const ActionContext = createContext(null)

export const ActionProvider = ({ children, handleAddSpriteAction, handleModSpriteAction, downloadMp4 }) => {
    const actions = {
        handleAddSpriteAction,
        handleModSpriteAction,
        downloadMp4
    }

  	const { tlData, setTLData } = useEditorStore()

    useEffect(() => {
        // 当 tlData 改变时执行某些操作
        console.log('tlData updated:', tlData)
    }, [tlData])

    return (
        <ActionContext.Provider value={actions}>
            {children}
        </ActionContext.Provider>
    )
}

export const useAction = () => {
    return useContext(ActionContext)
}

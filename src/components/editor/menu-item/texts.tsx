import { Button } from '@/components/ui/button'
import { DEFAULT_FONT } from '@/data/fonts'
import { nanoid } from 'nanoid'
import React, { useEffect, useRef, useContext } from 'react'
import { useAction } from '../actionContext'

export const Texts = () => {
    const { handleAction } = useAction()
    const handleAddText = () => {
        // handleAction('Hello from Text component!')
    // dispatcher?.dispatch(ADD_TEXT, {
    //   payload: {
    //     id: nanoid(),
    //     details: {
    //       text: 'Heading',
    //       fontSize: 120,
    //       width: 600,
    //       fontUrl: DEFAULT_FONT.url,
    //       fontFamily: DEFAULT_FONT.postScriptName,
    //       color: '#ffffff',
    //       wordWrap: 'break-word',
    //       wordBreak: 'break-all',
    //       textAlign: 'center',
    //     },
    //   },
    //   options: {},
    // });
    }

    return (
        <div className="flex-1">
            <div className="text-md text-text-primary font-medium h-12  flex items-center px-4">
        文本
            </div>
            <div className="px-4">
                <Button
                    onClick={handleAddText}
                    size="sm"
                    variant="secondary"
                    className="w-full"
                >
          添加文字
                </Button>
            </div>
        </div>
    )
}

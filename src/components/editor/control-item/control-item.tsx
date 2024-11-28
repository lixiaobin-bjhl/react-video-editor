import React from 'react'
import { ITrackItem } from '@designcombo/core'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Presets from './presets'
import Animations from './animations'
import Smart from './smart'
import BasicText from './basic-text'
import BasicImage from './basic-image'
import BasicVideo from './basic-video'
import BasicAudio from './basic-audio'
import useEditorStore from '@/store/use-editor-store'
import useLayoutStore from '@/store/use-layout-store'

const Container = ({ children }: { children: React.ReactNode }) => {
    const {displayToolbox, setDisplayToolbox, activeToolboxItem} = useLayoutStore()
    const {activeSprite} =  useEditorStore()
    return (
        <div
            style={{
                right: displayToolbox && activeToolboxItem ? '0' : '-100%',
                transition: 'right 0.25s ease-in-out',
                zIndex: 200,
            }}
            className="w-[340px] h-[calc(100%-32px-64px)] mt-6 absolute top-1/2 -translate-y-1/2 rounded-lg shadow-lg flex"
        >
            <div className="w-[266px] h-full relative bg-zinc-950 flex">
                <Button
                    variant="ghost"
                    className="absolute top-2 right-2 w-8 h-8 text-muted-foreground"
                    size="icon"
                >
                    <X width={16} onClick={() => setDisplayToolbox(false)} />
                </Button>
                {React.cloneElement(children as React.ReactElement<any>, {
                    activeSprite,
                    activeToolboxItem,
                })}
            </div>
            <div className="w-[74px]"></div>
        </div>
    )
}

const ActiveControlItem = ({
    activeSprite,
    activeToolboxItem,
}: {
    activeSprite?: any;
  activeToolboxItem?: string;
}) => {
    if (!activeSprite || !activeToolboxItem) {
        return null
    }
    return (
        <>
            {
                {
                    'basic-text': <BasicText trackItem={activeSprite} />,
                    'basic-image': <BasicImage />,
                    'basic-video': <BasicVideo />,
                    'basic-audio': <BasicAudio />,
                    'preset-text': <Presets />,
                    animation: <Animations />,
                    smart: <Smart />,
                }[activeToolboxItem]
            }
        </>
    )
}

export const ControlItem = () => {
    return (
        <Container>
            <ActiveControlItem />
        </Container>
    )
}

import Navbar from './navbar'
import MenuList from './menu-list'
import { MenuItem } from './menu-item'
import ControlList from './control-list'
import { ControlItem } from './control-item'
import useHotkeys from './use-hotkeys'
import { getCompactFontData } from '@/utils/fonts'
import { FONTS } from '@/data/fonts'
import useDataState from '@/store/use-data-state'
import { AVCanvas } from './av-canvas'
import { ActionProvider } from './actionContext'
import createFileWriter from './functions/createFileWriter'
import loadFile from './functions/loadFile'
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, createContext, act } from 'react'
import useLayoutStore from '@/store/use-layout-store'
import TimelineEditor from './timelineEditor'
import { nanoid } from 'nanoid'
import useEditorStore  from '@/store/use-editor-store'
import getActiveSprite from './functions/getActiveSprite'

import {
    AudioClip,
    ImgClip,
    MP4Clip,
    VisibleSprite,
    renderTxt2ImgBitmap,
} from '@webav/av-cliper'
import {
    TimelineAction,
    TimelineRow,
    TimelineState,
} from '@xzdarcy/react-timeline-editor'

type TLActionWithName = TimelineAction & { name: string };
const actionSpriteMap = new WeakMap<TimelineAction, VisibleSprite>()
const Editor = forwardRef((props, ref) => {
    const { setCompactFonts, setFonts} = useDataState()
    const {setActiveToolboxItem, setDisplayToolbox} = useLayoutStore()
    const [avCvs, setAVCvs] = useState<AVCanvas | null>(null)
    const [cvsWrapEl, setCvsWrapEl] = useState<HTMLDivElement | null>(null)
    const cvsRef = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [clipSource, setClipSource] = useState('local')
    const {setTrackItemsMap, activeSprite, setActiveSprite, trackItemsMap, setActiveId, tlData, setTLData} = useEditorStore()

    const tlState = useRef<TimelineState>()
    function addSprite2Track(
        trackId: string,
        spr: VisibleSprite,
        name = '',
        autoSetStartTime = true,
    ) {
        console.log('addSprite2Track', trackId)
        const updatedTlData = useEditorStore.getState().tlData
        const track = {
            id: trackId,
            actions: [],
        }
        // const track = tlData.find(({ id }) => id === trackId)
        // if (track == null) {
        //     return null
        // }
        // const start
        //     = autoSetStartTime && spr.time.offset === 0
        //         ? Math.max(...track.actions.map((a) => a.end), 0) * 1e6
        //         : spr.time.offset
        const start
        = autoSetStartTime && spr.time.offset === 0
            ?  Math.max(...track.actions.map((a) => a.end), 0) * 1e6
            : spr.time.offset

        spr.time.offset = start
        // image
        if (spr.time.duration === Infinity) {
            spr.time.duration = 10e6
        }
        // const action = {
        //     id: Math.random().toString(),
        //     start: start / 1e6,
        //     end: (spr.time.offset + spr.time.duration) / 1e6,
        //     effectId: '',
        //     name,
        // }
        const action = {
            trackId: trackId,
            id: trackId + '_' + Math.random().toString(),
            start: start / 1e6,
            end: (spr.time.offset + spr.time.duration) / 1e6,
            effectId: '',
            name,
        }
        console.log('current tlData', tlData)
        actionSpriteMap.set(action, spr)
        track.actions.push(action)
        updatedTlData.push(track)
        setTLData(updatedTlData)
        // setTLData(tlData.concat(track))
        // setTlData(tlData
        //     .filter((it) => it !== track)
        //     .concat({ ...track })
        //     .sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0)))
        // return action
    }
    async function addTextSprite(existSpr) {
        console.log('addTextSprite', existSpr)
        const detail = {
            text: '示例文字',
            fontSize: 20,
            color: 'red',
            x: 50,
            y: 50,
        }
        if (existSpr) {
            Object.assign(detail, existSpr.detail)
        }
        const spr = new VisibleSprite(new ImgClip(await renderTxt2ImgBitmap(
            detail.text,
            `font-size: ${detail.fontSize}px; color: ${detail.color}`,
        ),),)
        spr.rect.x = detail.x
        spr.rect.y = detail.y
        const id = nanoid()
        spr.id = id
        spr.detail = detail
        trackItemsMap[id] = spr
        spr.controlType = 'text'
        spr.on('propsChange', (changedProps) => {
            // console.log('propsChange', changedProps)
            Object.assign(spr.detail, changedProps.rect)
            setActiveSprite(spr)
        })
        setTrackItemsMap(trackItemsMap)
        await avCvs?.addSprite(spr)
        avCvs.activeSprite = spr
        setActiveId(id)
        setActiveSprite(spr)
        setActiveToolboxItem('basic-' + spr.controlType)
        setDisplayToolbox(true)
        addSprite2Track(id + '-text', spr, '文字')
    }

    const handleModSpriteAction = async (spr) => {
        // timeline数据清除
        const tlDataFiltered = tlData.filter((it) => it.id != (spr.id + '-' + spr.controlType))
        setTLData(tlDataFiltered)
        // 清除原来的文字
        avCvs.removeSprite(spr)
        delete trackItemsMap[spr.id]
        // 重新添加
        await addTextSprite(spr)
    }
    const handleDelSpriteByAction = async (action) => {
        const sprId = action.trackId.replace(/-\w+/, '')
        setActiveId(sprId)
        avCvs.removeSprite(trackItemsMap[sprId])
        delete trackItemsMap[sprId]
        // timeline数据清除
        const tlDataFiltered = tlData.filter((it) => it.id != (action.trackId))
        setTLData(tlDataFiltered)
    }
    useHotkeys()
    const handleAddSpriteAction = async (data) => {
        console.log('handleAddSpriteAction', data)
        switch (data.type) {
            case 'text' :
                await addTextSprite()
        }
    }

    const downloadMp4 = async () => {
        if (avCvs == null) {
            return
        }
        (await avCvs.createCombinator())
            .output()
            .pipeTo(await createFileWriter('mp4'))
    }

    useEffect(() => {
        if (cvsWrapEl == null) {
            return
        }
        avCvs?.destroy()
        const cvs = new AVCanvas(cvsWrapEl, {
            bgColor: '#ff9900',
            width: 750,
            height: 1334,
        })
        setAVCvs(cvs)
        cvs.on('timeupdate', (time) => {
            if (tlState.current == null) {
                return
            }
            tlState.current.setTime(time / 1e6)
        })
        cvs.on('playing', () => {
            setPlaying(true)
        })
        cvs.on('paused', () => {
            setPlaying(false)
        })
        cvs.on('activeSpriteChange', (s: VisibleSprite | null) => {
            if (!s?.id) {
                return
            }
            setActiveId(s.id)
            console.log('activeSpriteChange', getActiveSprite())
        })
        setCompactFonts(getCompactFontData(FONTS))
        setFonts(FONTS)
    }, [cvsWrapEl])
    return (
        <ActionProvider
            handleAddSpriteAction={handleAddSpriteAction}
            handleModSpriteAction={handleModSpriteAction}
            downloadMp4={downloadMp4}>
            <div>
                <div className="h-screen w-screen flex flex-col">
                    <Navbar />
                    <div className="flex-1 relative overflow-hidden">
                        <MenuList />
                        <MenuItem />
                        <ControlList />
                        <ControlItem />
                        <div className="canvas-wrap flex" style={{ border: '1px solid red', display: 'flex', justifyContent: 'center' }}>
                            <div ref={(el) => setCvsWrapEl(el)}></div>
                        </div>
                    </div>
                    <div className="flex">
                        <input
                            type="radio"
                            id="clip-source-remote"
                            name="clip-source"
                            defaultChecked={clipSource === 'remote'}
                            onChange={() => {
                                setClipSource('remote')
                            }}
                        />
                        <label htmlFor="clip-source-remote">示例素材</label>
                        <input
                            type="radio"
                            id="clip-source-local"
                            name="clip-source"
                            defaultChecked={clipSource === 'local'}
                            onChange={() => {
                                setClipSource('local')
                            }}
                        />
                        <label htmlFor="clip-source-local"> 本地素材</label>
                        <span className="mx-[10px]">|</span>
                        <button
                            className="mx-[10px]"
                            onClick={async () => {
                                if (avCvs == null || tlState.current == null) {
                                    return
                                }
                                console.log('playing', playing)
                                console.log('avCvs', avCvs)
                                if (playing) {
                                    avCvs.pause()
                                }
                                else {
                                    avCvs.play({ start: tlState.current.getTime() * 1e6 })
                                }
                            }}
                        >
                            {playing ? '暂停' : '播放'}
                        </button>
                        <button
                            className="mx-[10px]"
                            onClick={downloadMp4}
                        >
                            导出视频
                        </button>
                        <button
                            className="mx-[10px]"
                            onClick={async () => {
                                const stream
                                    = clipSource === 'local'
                                        ? (await loadFile({ 'video/*': ['.mp4', '.mov'] })).stream()
                                        : (await fetch('./video/bunny_0.mp4')).body!
                                const spr = new VisibleSprite(new MP4Clip(stream))
                                await avCvs?.addSprite(spr)
                                addSprite2Track('1-video', spr, '视频')
                            }}
                        >
                            + 视频
                        </button>
                        <button
                            className="mx-[10px]"
                            onClick={async () => {
                                const stream
                                    = clipSource === 'local'
                                        ? (await loadFile({ 'audio/*': ['.mp3', '.m4a'] })).stream()
                                        : (await fetch('./audio/16kHz-1chan.mp3')).body!
                                const spr = new VisibleSprite(new AudioClip(stream))
                                await avCvs?.addSprite(spr)
                                addSprite2Track('2-audio', spr, '音频')
                            }}
                        >
                            + 音频
                        </button>
                        <button
                            className="mx-[10px]"
                            onClick={async () => {
                                const stream
                                    = clipSource === 'local'
                                        ? (await loadFile({ 'image/*': ['.jpg', '.png'] })).stream()
                                        : (await fetch('./img/bunny.png')).body!
                                const spr = new VisibleSprite(new ImgClip(stream))
                                await avCvs?.addSprite(spr)
                                addSprite2Track('3-img', spr, '图片')
                            }}
                        >
                            + 图片
                        </button>
                        <button
                            className="mx-[10px]"
                            onClick={() => {
                                handleAddSpriteAction({type: 'text'})
                            }}
                        >
                            + 文字
                        </button>
                        {/* <button
                            className="mx-[10px]"
                            onClick={async () => {

                                const spr = new VisibleSprite(new ImgClip(await renderTxt2ImgBitmap(
                                    '示例文字',
                                    'font-size: 80px; color: red;',
                                ),),)
                                spr.rect.y = 10
                                const id = nanoid()
                                // 1111111111111111
                                spr.id = id
                                trackItemsMap[id] = spr
                                spr.controlType = 'text'
                                // spr.on('propsChange', (changedProps) => {
                                //     console.log('changedProps', changedProps)
                                // })
                                setTrackItemsMap(trackItemsMap)
                                // setControlType('text')
                                await avCvs?.addSprite(spr)
                                addSprite2Track('4-text', spr, '文字')
                            }}
                        >
                            + 文字
                        </button> */}
                    </div>
                    <TimelineEditor
                        timelineData={tlData}
                        timelineState={tlState}
                        onPreviewTime={(time) => {
                            avCvs?.previewFrame(time * 1e6)
                        }}
                        onOffsetChange={(action) => {
                            const spr = actionSpriteMap.get(action)
                            if (spr == null) {
                                return
                            }
                            spr.time.offset = action.start * 1e6
                        }}
                        onDurationChange={({ action, start, end }) => {
                            const spr = actionSpriteMap.get(action)
                            if (spr == null) {
                                return false
                            }
                            const duration = (end - start) * 1e6
                            if (duration > spr.getClip().meta.duration) {
                                return false
                            }
                            spr.time.duration = duration
                            return true
                        }}
                        onDeleteAction={(action) => {
                            handleDelSpriteByAction(action)
                            // const spr = actionSpriteMap.get(action)
                            // if (spr == null) {
                            //     return
                            // }
                            // avCvs?.removeSprite(spr)
                            // actionSpriteMap.delete(action)
                            // const track = tlData
                            //     .map((t) => t.actions)
                            //     .find((actions) => actions.includes(action))
                            // if (track == null) {
                            //     return
                            // }
                            // track.splice(track.indexOf(action), 1)
                            // setTLData([...tlData])
                        }}
                        onSplitAction={async (action: TLActionWithName) => {
                            const spr = actionSpriteMap.get(action)
                            if (avCvs == null || spr == null || tlState.current == null) {
                                return
                            }
                            const newClips = await spr
                                .getClip()
                                .split(tlState.current.getTime() * 1e6 - spr.time.offset)
                            // 移除原有对象
                            avCvs.removeSprite(spr)
                            actionSpriteMap.delete(action)
                            const track = tlData.find((t) => t.actions.includes(action))
                            if (track == null) {
                                return
                            }
                            track.actions.splice(track.actions.indexOf(action), 1)
                            setTLData([...tlData])
                            // 添加分割后生成的两个新对象
                            const sprsDuration = [
                                tlState.current.getTime() * 1e6 - spr.time.offset,
                                spr.time.duration
                                - (tlState.current.getTime() * 1e6 - spr.time.offset),
                            ]
                            const sprsOffset = [
                                spr.time.offset,
                                spr.time.offset + sprsDuration[0],
                            ]
                            for (let i = 0; i < newClips.length; i++) {
                                const clip = newClips[i]
                                const newSpr = new VisibleSprite(clip)
                                if (clip instanceof ImgClip) {
                                    newSpr.time.duration = sprsDuration[i]
                                }
                                newSpr.time.offset = sprsOffset[i]
                                await avCvs.addSprite(newSpr)
                                addSprite2Track(track.id, newSpr, action.name, false)
                            }
                        }}
                    ></TimelineEditor>
                </div>
            </div>
        </ActionProvider>
    )
})

export default Editor

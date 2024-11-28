import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, Ellipsis, Strikethrough, Underline } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import Opacity from './common/opacity'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Transform from './common/transform'
import _ from 'lodash'
import { useAction } from '../actionContext'
import useEditorStore from '@/store/use-editor-store'

interface ITextControlProps {
  value: string;
  color: string;
  x: number;
  y: number
  colorDisplay: string;
  fontSize: number;
  fontSizeDisplay: string;
  fontFamily: string;
  fontFamilyDisplay: string;
  opacity: number;
  opacityDisplay: string;
  textAlign: string;
  textDecoration: string;
}
const BasicText = ({ trackItem }: { trackItem: ITrackItem }) => {
    const {activeSprite} = useEditorStore()
    const [properties, setProperties] = useState<ITextControlProps>({
        color: '#000000',
        x: 0,
        y: 0,
        colorDisplay: '#000000',
        fontSize: 12,
        value: '',
        fontSizeDisplay: '12px',
        fontFamily: 'Open Sans',
        fontFamilyDisplay: 'Open Sans',
        opacity: 1,
        opacityDisplay: '100%',
        textAlign: 'left',
        textDecoration: 'none',
    })

    const {handleModSpriteAction} = useAction()

    useEffect(() => {
        if (!activeSprite) {
            return
        }
        setProperties({
            value: activeSprite?.detail?.text || '',
            x: activeSprite?.detail?.x || 0,
            y: activeSprite?.detail?.y || 0
        })
    }, [ activeSprite.detail.x, activeSprite.detail.y, activeSprite.detail.text])

    const debouncedInputChangeHandler = useCallback(
        _.debounce((value) => {
            // 这里可以添加你希望执行的其他逻辑
            console.log('输入完成:', value)
            if (activeSprite) {
                activeSprite.detail.text = value
                handleModSpriteAction(activeSprite)
            }
            else {
                console.error('sprite not found')
            }
        }, 1000),
        []
    )


    const handleInputTextChange = (e: any) => {
        const value = event.target.value
        setProperties({
            ...properties,
            value
        })
        debouncedInputChangeHandler(value)
    }

    const handleXChange = (e: any) => {
        const value = event.target.value
        setProperties({
            ...properties,
            x: value
        })
        if (activeSprite) {
            activeSprite.detail.x = +value
            activeSprite.rect.x = +value
        }
        else {
            console.error('sprite not found')
        }
    }

    const handleYChange = (e: any) => {
        const value = event.target.value
        setProperties({
            ...properties,
            x: value
        })
        if (activeSprite) {
            activeSprite.detail.y = +value
            activeSprite.rect.y = +value
        }
        else {
            console.error('sprite not found')
        }
    }

    return (
        <div className="flex-1 flex flex-col">
            <div className="text-md text-text-primary font-medium h-12  flex items-center px-4 flex-none">
        文本
            </div>
            <ScrollArea className="h-full">
                <div className="px-4 flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Input placeholder="请输入文本" value={properties.value}  onChange={handleInputTextChange}  className="h-9" />
                        <div className="relative">
                            <Input placeholder="请输入水平位置"  onChange={handleXChange} value={properties.x || ''} type="number"  className="px-2 text-sm" />
                            <div className="absolute top-1/2 transform -translate-y-1/2 right-2.5 text-zinc-200">
                                x
                            </div>
                        </div>
                        <div className="relative">
                            <Input placeholder="请输入垂直位置" value={properties.y}  onChange={handleYChange} type="number" className=" px-2 text-sm" />
                            <div className="absolute top-1/2 transform -translate-y-1/2 right-2.5 text-zinc-200">
                                y
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

const Fill = () => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 24px 24px',
                gap: '4px',
            }}
        >
            <div className="text-sm text-zinc-500  flex items-center">Fill</div>
            <div>
                <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
            </div>
            <div>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Ellipsis size={14} />
                </Button>
            </div>
        </div>
    )
}

const Stroke = () => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 24px 24px',
                gap: '4px',
            }}
        >
            <div className="text-sm text-zinc-500  flex items-center">Stroke</div>
            <div>
                <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
            </div>
            <div>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Ellipsis size={14} />
                </Button>
            </div>
        </div>
    )
}
const Shadow = () => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 24px 24px',
                gap: '4px',
            }}
        >
            <div className="text-sm text-zinc-500  flex items-center">Shadow</div>
            <div>
                <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
            </div>
            <div>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Ellipsis size={14} />
                </Button>
            </div>
        </div>
    )
}
const Background = () => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 24px 24px',
                gap: '4px',
            }}
        >
            <div className="text-sm text-zinc-500  flex items-center">Background</div>
            <div>
                <div className="w-6 h-6 rounded-sm border-2 border-zinc-800 bg-green-700"></div>
            </div>
            <div>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Ellipsis size={14} />
                </Button>
            </div>
        </div>
    )
}


const TextDecoration = () => {
    const [value, setValue] = useState(['left'])
    const onChangeAligment = (value: string[]) => {
        setValue(value)
    }
    return (
        <ToggleGroup
            value={value}
            size="sm"
            className="grid grid-cols-3"
            type="multiple"
            onValueChange={onChangeAligment}
        >
            <ToggleGroupItem size="sm" value="left" aria-label="Toggle left">
                <Underline size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="strikethrough" aria-label="Toggle italic">
                <Strikethrough size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="overline" aria-label="Toggle strikethrough">
                <div>
                    <svg
                        width={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.59996 1.75977C5.43022 1.75977 5.26744 1.82719 5.14741 1.94722C5.02739 2.06724 4.95996 2.23003 4.95996 2.39977C4.95996 2.5695 5.02739 2.73229 5.14741 2.85231C5.26744 2.97234 5.43022 3.03977 5.59996 3.03977H18.4C18.5697 3.03977 18.7325 2.97234 18.8525 2.85231C18.9725 2.73229 19.04 2.5695 19.04 2.39977C19.04 2.23003 18.9725 2.06724 18.8525 1.94722C18.7325 1.82719 18.5697 1.75977 18.4 1.75977H5.59996ZM7.99996 6.79977C7.99996 6.58759 7.91568 6.38411 7.76565 6.23408C7.61562 6.08405 7.41213 5.99977 7.19996 5.99977C6.98779 5.99977 6.7843 6.08405 6.63428 6.23408C6.48425 6.38411 6.39996 6.58759 6.39996 6.79977V15.2798C6.39996 16.765 6.98996 18.1894 8.04016 19.2396C9.09037 20.2898 10.5147 20.8798 12 20.8798C13.4852 20.8798 14.9096 20.2898 15.9598 19.2396C17.01 18.1894 17.6 16.765 17.6 15.2798V6.79977C17.6 6.58759 17.5157 6.38411 17.3656 6.23408C17.2156 6.08405 17.0121 5.99977 16.8 5.99977C16.5878 5.99977 16.3843 6.08405 16.2343 6.23408C16.0842 6.38411 16 6.58759 16 6.79977V15.2798C16 16.3406 15.5785 17.358 14.8284 18.1082C14.0782 18.8583 13.0608 19.2798 12 19.2798C10.9391 19.2798 9.92168 18.8583 9.17153 18.1082C8.42139 17.358 7.99996 16.3406 7.99996 15.2798V6.79977Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

const Alignment = () => {
    const [value, setValue] = useState('left')
    const onChangeAligment = (value: string) => {
        setValue(value)
    }
    return (
        <ToggleGroup
            value={value}
            size="sm"
            className="grid grid-cols-3"
            type="single"
            onValueChange={onChangeAligment}
        >
            <ToggleGroupItem size="sm" value="left" aria-label="Toggle left">
                <AlignLeft size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <AlignCenter size={18} />
            </ToggleGroupItem>
            <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
                <AlignRight size={18} />
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

export default BasicText

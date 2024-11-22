import {
    TimelineRow,
} from '@xzdarcy/react-timeline-editor'

export interface IFont {
  id: string;
  family: string;
  fullName: string;
  postScriptName: string;
  preview: string;
  style: string;
  url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
}

export interface ICompactFont {
  family: string;
  styles: IFont[];
  default: IFont;
  name?: string;
}

export interface IDataState {
  fonts: IFont[];
  compactFonts: ICompactFont[];
  setFonts: (fonts: IFont[]) => void;
  setCompactFonts: (compactFonts: ICompactFont[]) => void;
}
export interface ITrackItem {
    id: string;
    name: string;
}

export interface ITrackItemsMap {
    [id: string]: ITrackItem;
}
export interface IEditorState {
  trackItemsMap: ITrackItemsMap;
  activeId: string | null;
  activeSprite: any | null;
  controlType: string | null;
  tlData: TimelineRow[];
  setTLData: (tlData: TimelineRow[]) => void;
  setControlType: (controlType: string | null) => void;
  setTrackItemsMap: (trackItemsMap: ITrackItemsMap) => void;
  setActiveId: (activeId: string | null) => void;
  setActiveSprite: (activeSprite: any | null) => void;
}

export type IPropertyType = 'textContent' | 'fontSize' | 'color';

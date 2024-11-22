export type IMenuItem =
  | 'uploads'
  | 'templates'
  | 'videos'
  | 'images'
  | 'shapes'
  | 'audios'
  | 'transitions'
  | 'texts';
export interface ILayoutState {
  activeMenuItem: IMenuItem | null;
  showMenuItem: boolean;
  controlType: string;
  showControlItem: boolean;
  showToolboxItem: boolean;
  activeToolboxItem: string | null;
  setActiveMenuItem: (showMenu: IMenuItem | null) => void;
  setShowMenuItem: (showMenuItem: boolean) => void;
  setShowControlItem: (showControlItem: boolean) => void;
  setShowToolboxItem: (showToolboxItem: boolean) => void;
  setControlType: (controlType: string) => void;


  displayToolbox: boolean;
  setDisplayToolbox: (displayToolbox: boolean) => void;
  setActiveToolboxItem: (activeToolboxItem: string | null) => void;

}

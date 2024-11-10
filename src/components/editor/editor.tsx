import { Timeline, Provider, Scene } from '@designcombo/core';
import Navbar from './navbar';
import MenuList from './menu-list';
import { MenuItem } from './menu-item';
import ControlList from './control-list';
import { ControlItem } from './control-item';

import useHotkeys from './use-hotkeys';
import { getCompactFontData } from '@/utils/fonts';
import { FONTS } from '@/data/fonts';
import useDataState from '@/store/use-data-state';
import { AVCanvas } from './av-canvas';
import React, { useEffect, useRef, useState } from 'react';

export const theme = {
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
      1000: '#040405',
      1100: '#010101',
    },
  },
};

const Editor = () => {
  const { setCompactFonts, setFonts } = useDataState();
  const [avCvs, setAVCvs] = useState<AVCanvas | null>(null);
  const [cvsWrapEl, setCvsWrapEl] = useState<HTMLDivElement | null>(null);
  useHotkeys();

  useEffect(() => {

    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
    if (cvsWrapEl == null) return;
    avCvs?.destroy();
    const cvs = new AVCanvas(cvsWrapEl, {
      bgColor: '#ff9900',
      width: 1280,
      height: 720,
    });
  }, [cvsWrapEl]);

  return (
    <Provider theme={theme}>
      <div className="h-screen w-screen flex flex-col">
        <Navbar />
        <div className="flex-1 relative overflow-hidden">
          <MenuList />
          <MenuItem />
          <ControlList />
          <ControlItem />
          <div className="canvas-wrap">
            <div ref={(el) => setCvsWrapEl(el)} className="mb-[10px]"></div>
            </div>
          </div>
          {/* <Scene /> */}
        </div>
        <div className="h-80 flex" style={{ zIndex: 201 }}>
          <Timeline />
        </div>
    </Provider>
  );
};

export default Editor;

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable react/display-name */

import { forwardRef, useRef } from 'react';
import { TabWrapper } from './Wrappers';
import { useEventListener } from 'usehooks-ts';
import { useTabs } from 'contexts/Tabs';
import { useMenu } from 'contexts/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Menu } from './Menu';
import type { AnyJson } from '@polkadot-cloud/react/types';

export const Presentational = forwardRef((props: AnyJson, ref) => {
  const { tabs, addInstantiatedId } = useTabs();
  const { openMenu } = useMenu();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { id, name, ...rest } = props;
  // Update the tab to instantiated.
  addInstantiatedId(id);

  // Handle context menu when tab is right clicked.
  const handleTabContextMenu = (ev: MouseEvent): void => {
    // ev.preventDefault();
    openMenu(ev, <Menu />);
  };

  // Listen to `contextmenu` events.
  useEventListener('contextmenu', handleTabContextMenu, buttonRef);

  return (
    <TabWrapper
      ref={ref}
      className={`active hide-border`}
      style={{ width: '135px' }}
      {...rest}
    >
      <div className="fade" />
      <button ref={buttonRef} className="name">
        {name}
      </button>

      {tabs.length > 1 && (
        <button className="close">
          <FontAwesomeIcon icon={faClose} transform="shrink-1" />
        </button>
      )}
    </TabWrapper>
  );
});

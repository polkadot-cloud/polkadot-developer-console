// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable react/display-name */

import { TabWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import type { TabProps } from './types';
import { DEFAULT_TAB_WIDTH_PX } from 'contexts/Tabs/defaults';

export const TabOverlay = ({ name }: TabProps) => (
  <TabWrapper
    className={`active hide-border`}
    style={{ width: DEFAULT_TAB_WIDTH_PX }}
  >
    <div className="fade" />
    <div className="name">{name}</div>

    <button className="close">
      <FontAwesomeIcon icon={faClose} transform="shrink-1" />
    </button>
  </TabWrapper>
);

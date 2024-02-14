// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable react/display-name */

import { TabWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import type { TabProps } from './types';

export const TabOverlay = ({ name }: TabProps) => (
  <TabWrapper className={`active hide-border`} style={{ width: '135px' }}>
    <div className="fade" />
    <div className="name">{name}</div>

    <button className="close">
      <FontAwesomeIcon icon={faClose} transform="shrink-1" />
    </button>
  </TabWrapper>
);

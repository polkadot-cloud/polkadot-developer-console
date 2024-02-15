// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonWrapper, ChainManuWrapper } from './Wrappers';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';

export const ChainMenu = () => {
  const { tabsHidden, setTabsHidden } = useTabs();

  return (
    <ChainManuWrapper>
      <div className="menu">
        <div>Not Connected</div>
      </div>
      <div className="config">
        <ButtonWrapper
          onClick={() => setTabsHidden(!tabsHidden)}
          className="action"
        >
          <FontAwesomeIcon
            icon={tabsHidden ? faAngleDown : faAngleUp}
            transform="shrink-3"
          />
        </ButtonWrapper>
      </div>
    </ChainManuWrapper>
  );
};

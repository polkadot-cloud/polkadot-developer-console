// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import { ChainMenuWrapper, ButtonWrapper } from 'library/ChainMenu/Wrappers';

export const Menu = () => {
  const { pathname } = useLocation();
  const { tabsHidden, setTabsHidden } = useTabs();

  return (
    <ChainMenuWrapper>
      <div className="menu">
        <div>Not Connected</div>
      </div>
      <div className="config">
        <ButtonWrapper
          onClick={() => setTabsHidden(!tabsHidden)}
          className="action"
          disabled={pathname !== '/'}
        >
          <FontAwesomeIcon
            icon={tabsHidden ? faAngleDown : faAngleUp}
            transform="shrink-3"
          />
        </ButtonWrapper>
      </div>
    </ChainMenuWrapper>
  );
};

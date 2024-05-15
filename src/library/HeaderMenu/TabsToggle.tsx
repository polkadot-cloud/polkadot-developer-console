// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { ButtonWrapper } from './Wrappers';
import { useSettings } from 'contexts/Settings';

export const TabsToggle = () => {
  const { pathname } = useLocation();
  const { tabsHidden, setTabsHidden } = useSettings();

  return (
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
  );
};

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { ControlsWrapper, TabWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlug, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';
import type { ControlsProps } from './types';
import { useNavigate } from 'react-router-dom';
import { ControlWithTooltip } from './ControlWithTooltip';
import { useMenu } from 'contexts/Menu';
import { InDevelopment } from 'library/HelpMenu/InDevelopment';

export const Controls = ({ tabContainerRef }: ControlsProps) => {
  const navigate = useNavigate();
  const { createTab } = useTabs();
  const { openMenu } = useMenu();

  return (
    <ControlsWrapper>
      <div>
        <TabWrapper
          onClick={() => {
            createTab();
            setTimeout(() => {
              if (tabContainerRef.current) {
                tabContainerRef.current?.scrollTo({
                  left: tabContainerRef.current.scrollWidth,
                  behavior: 'smooth',
                });
              }
            }, TAB_TRANSITION_DURATION_MS);
          }}
          className="action"
        >
          <FontAwesomeIcon icon={faPlus} className="icon" /> New
        </TabWrapper>
      </div>
      <div>
        <TabWrapper
          className="action inactive"
          onClick={(ev) => {
            openMenu(ev, <InDevelopment />, { size: 'large' });
          }}
        >
          Accounts
        </TabWrapper>
        <ControlWithTooltip
          icon={faPlug}
          tooltipText="Connect Wallets"
          onClick={(ev) => {
            openMenu(ev, <InDevelopment />, { size: 'large' });
          }}
          inactive
        />
        <ControlWithTooltip
          icon={faGear}
          tooltipText="Settings"
          onClick={() => navigate('/settings')}
          last
        />
      </div>
    </ControlsWrapper>
  );
};

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
import { useConnect } from 'contexts/Connect';
import { useTooltip } from 'contexts/Tooltip';

export const TabControls = ({ tabContainerRef }: ControlsProps) => {
  const navigate = useNavigate();
  const { createTab } = useTabs();
  const { closeTooltip } = useTooltip();
  const { openConnectOverlay } = useConnect();

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
          <FontAwesomeIcon icon={faPlus} />
        </TabWrapper>
      </div>
      <div>
        <ControlWithTooltip
          icon={faPlug}
          tooltipText="Connect Wallets"
          onClick={(ev) => {
            closeTooltip();
            openConnectOverlay(ev);
          }}
        />
        <ControlWithTooltip
          icon={faGear}
          tooltipText="Settings"
          onClick={() => {
            closeTooltip();
            navigate('/settings');
          }}
          last
        />
      </div>
    </ControlsWrapper>
  );
};

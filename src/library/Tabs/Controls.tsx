// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { ControlsWrapper, TabWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPlug, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';
import type { ControlsProps } from './types';
import { useNavigate } from 'react-router-dom';
import { useTooltip } from 'contexts/Tooltip';
import { useRef } from 'react';

export const Controls = ({ tabContainerRef }: ControlsProps) => {
  const navigate = useNavigate();
  const { createTab } = useTabs();
  const { openTooltip } = useTooltip();

  const tooltipBoundRef = useRef(null);

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
          onClick={() => {
            /* Do nothing. */
          }}
          className="action"
        >
          Accounts
        </TabWrapper>
        <TabWrapper
          ref={tooltipBoundRef}
          onHoverStart={(ev) =>
            openTooltip(ev, 'Connect Accounts', tooltipBoundRef)
          }
          onClick={() => {
            /* Do nothing. */
          }}
          className="action"
        >
          <FontAwesomeIcon icon={faPlug} />
        </TabWrapper>
        <TabWrapper
          onClick={() => {
            navigate('/settings');
          }}
          className="action last"
        >
          <FontAwesomeIcon icon={faGear} />
        </TabWrapper>
      </div>
    </ControlsWrapper>
  );
};

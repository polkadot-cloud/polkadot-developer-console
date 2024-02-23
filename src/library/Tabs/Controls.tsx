// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { ControlsWrapper, TabWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';
import type { ControlsProps } from './types';

export const Controls = ({ tabContainerRef }: ControlsProps) => {
  const { createTab } = useTabs();

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
          onClick={() => {
            /* Do nothing. */
          }}
          className="action last"
        >
          <FontAwesomeIcon icon={faPlug} />
        </TabWrapper>
      </div>
    </ControlsWrapper>
  );
};

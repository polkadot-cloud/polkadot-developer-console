// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper, RelayIconWrapper } from '../Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { Icon } from '../Icon';
import { Section } from './Section';
import { Connector } from './Connector';

export const Progress = () => {
  const { getActiveStep } = useParaSetup();
  const { tabId, ownerId } = useActiveTab();
  const { getChainApi } = useChainSpaceEnv();

  const activeStep = getActiveStep(tabId);
  const relayInstance = getChainApi(ownerId, 'parachainSetup:relay');

  // Get the relay chain icon, if available.
  const relayIcon = relayInstance ? relayInstance.chainId : undefined;

  // Whether to show the status icons.
  const collapsedStatus = relayIcon !== undefined;

  // Temporary flag for incomplete status items until proper state is introduced.
  const showStatus = false;

  return (
    <ProgressWrapper>
      <Section
        stepId="connect_relay"
        label="Select Relay Chain"
        collapsedStatus={collapsedStatus}
        showStatus={relayIcon !== undefined}
      >
        {relayIcon && (
          <RelayIconWrapper
            className={`${activeStep === 'connect_relay' ? `active` : ``}`}
          >
            <Icon icon={relayIcon} />
          </RelayIconWrapper>
        )}
      </Section>
      <Connector />
      <Section
        stepId="reserve_para_id"
        label="Reserve Para ID"
        collapsedStatus={collapsedStatus}
        showStatus={showStatus}
      >
        ...
      </Section>
      <Connector />
      <Section
        stepId="configure_node"
        label="Configure Node"
        collapsedStatus={collapsedStatus}
        showStatus={showStatus}
      >
        ...
      </Section>
      <Connector />
      <Section
        stepId="register_parathread"
        label="Register Parathread"
        collapsedStatus={collapsedStatus}
        showStatus={showStatus}
      >
        ...
      </Section>
      <Connector inactive={activeStep === 'get_coretime'} />
      <Section
        stepId="get_coretime"
        label="Get Coretime"
        collapsedStatus={collapsedStatus}
        showStatus={showStatus}
        className="last"
      >
        ...
      </Section>

      {activeStep === 'get_coretime' && <Connector className="smallOnly" />}
    </ProgressWrapper>
  );
};

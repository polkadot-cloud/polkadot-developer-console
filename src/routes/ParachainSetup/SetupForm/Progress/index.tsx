// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper, ProgressBadgeWrapper } from '../Wrappers';
import { Icon } from '../Icon';
import { Section } from './Section';
import { Connector } from './Connector';
import { useParachain } from 'routes/ParachainSetup/Provider';

export const Progress = () => {
  const { getActiveStep } = useParaSetup();
  const { tabId } = useActiveTab();
  const {
    chain: { id: chainId },
  } = useParachain();

  const activeStep = getActiveStep(tabId);

  // Whether to show the status icons.
  const collapsedStatus = true;

  // Temporary flag for incomplete status items until proper state is introduced.
  const showStatus = false;

  return (
    <ProgressWrapper>
      <Section
        stepId="connect_relay"
        label="Select Relay Chain"
        collapsedStatus={collapsedStatus}
        showStatus={chainId !== undefined}
      >
        {chainId && (
          <ProgressBadgeWrapper
            className={`${activeStep === 'connect_relay' ? `active` : ``}`}
          >
            <Icon icon={chainId} />
          </ProgressBadgeWrapper>
        )}
      </Section>
      <Connector />
      <Section
        stepId="reserve_para_id"
        label="Reserve Para ID"
        collapsedStatus={collapsedStatus}
        showStatus={showStatus}
      >
        <ProgressBadgeWrapper
          className={`${activeStep === 'reserve_para_id' ? `active` : ``}`}
        >
          <Icon icon={chainId} />
        </ProgressBadgeWrapper>
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

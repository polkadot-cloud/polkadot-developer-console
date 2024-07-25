// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper, ProgressBadgeWrapper } from './Wrappers';
import { Icon } from '../Icon';
import { Section } from './Section';
import { Connector } from './Connector';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { useReserveParaId } from 'contexts/ParaSetup/ReserveParaId';
import BigNumber from 'bignumber.js';

export const Progress = () => {
  const {
    chain: { id: chainId },
  } = useParachain();
  const { tabId } = useActiveTab();
  const { getActiveStep } = useParaSetup();
  const { validateParaId, getSelectedAccount } = useReserveParaId();

  // The currently active setup step.
  const activeStep = getActiveStep(tabId);

  // A reserved para id for the current tab, if any.
  const reservedParaId = validateParaId(tabId, getSelectedAccount(tabId) || '');

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
        showStatus={reservedParaId !== undefined}
      >
        {reservedParaId !== undefined && (
          <div>
            <h4>{new BigNumber(reservedParaId.paraId).toFormat()}</h4>
          </div>
        )}
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

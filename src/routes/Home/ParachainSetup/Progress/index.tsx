// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper, RelayIconWrapper } from '../Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { Icon } from '../Icon';
import { Section } from './Section';

export const Progress = () => {
  const { tabId } = useActiveTab();
  const { getChainApi } = useChainSpaceEnv();
  const { getActiveStep, getChainSpaceApiIndex } = useParaSetup();

  const activeStep = getActiveStep(tabId);
  const chainSpaceApiIndex = getChainSpaceApiIndex(tabId);
  const relayInstance = getChainApi(chainSpaceApiIndex);

  // Get the relay chain icon, if available.
  const relayIcon = relayInstance
    ? `../../../config/networks/icons/${relayInstance.chainId}/Inline.tsx`
    : undefined;

  // Whether to show the status icons.
  const showStatus = relayIcon !== undefined;

  // Temporary flag for incomplete status items until proper state is introduced.
  const incompleteStatus = true;

  return (
    <ProgressWrapper>
      <Section stepId="connect_relay" label="Select Relay Chain">
        <div className={`status ${!showStatus ? `collapsed` : ``}`}>
          {relayIcon && (
            <RelayIconWrapper>
              <Icon icon={relayIcon} />
            </RelayIconWrapper>
          )}
        </div>
      </Section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>

      <Section stepId="reserve_para_id" label="Reserve Para ID">
        <div
          className={`status ${!showStatus ? `collapsed` : incompleteStatus ? `hidden` : ``}`}
        ></div>
      </Section>

      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>

      <Section stepId="configure_node" label="Configure Node">
        <div
          className={`status ${!showStatus ? `collapsed` : incompleteStatus ? `hidden` : ``}`}
        ></div>
      </Section>

      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>

      <Section stepId="register_parathread" label="Register Parathread">
        <div
          className={`status ${!showStatus ? `collapsed` : incompleteStatus ? `hidden` : ``}`}
        ></div>
      </Section>

      <section
        className={`spacer ${activeStep !== 'get_coretime' ? `` : `inactive`}`}
      >
        <span className="connector"></span>
      </section>

      <Section stepId="get_coretime" label="Get Coretime">
        <div
          className={`status ${!showStatus ? `collapsed` : incompleteStatus ? `hidden` : ``}`}
        ></div>
      </Section>

      {activeStep === 'get_coretime' && (
        <section className="spacer smallOnly">
          <span className="connector"></span>
        </section>
      )}
    </ProgressWrapper>
  );
};

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper, RelayIconWrapper } from './Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { Icon } from './Icon';

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

  return (
    <ProgressWrapper>
      <section
        className={`label ${activeStep === 'connect_relay' ? `active` : `inactive`}`}
      >
        <h4>Select Relay Chain</h4>
        <div className={`status`}>
          {relayIcon && (
            <RelayIconWrapper>
              <Icon icon={relayIcon} />
            </RelayIconWrapper>
          )}
        </div>
      </section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>
      <section
        className={`label ${activeStep === 'reserve_para_id' ? `active` : `inactive`}`}
      >
        <h4>Reserve Para ID</h4>
        <div className={`status`}></div>
      </section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>
      <section
        className={`label ${activeStep === 'configure_node' ? `active` : `inactive`}`}
      >
        <h4>Configure Node</h4>
        <div className={`status`}></div>
      </section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>
      <section
        className={`label ${activeStep === 'register_parathread' ? `active` : `inactive`}`}
      >
        <h4>Register Parathread</h4>
        <div className={`status`}></div>
      </section>
      <section
        className={`spacer ${activeStep !== 'get_coretime' ? `` : `inactive`}`}
      >
        <span className="connector"></span>
      </section>
      <section
        className={`label ${activeStep === 'get_coretime' ? `active` : `inactive`} last`}
      >
        <h4>Get Coretime</h4>
        <div className={`status`}></div>
      </section>

      {activeStep === 'get_coretime' && (
        <section className="spacer smallOnly">
          <span className="connector"></span>
        </section>
      )}
    </ProgressWrapper>
  );
};

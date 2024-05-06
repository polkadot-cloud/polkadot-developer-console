// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper } from './Wrappers';

export const Progress = () => {
  const { tabId } = useActiveTab();
  const { getActiveStep } = useParaSetup();
  const activeStep = getActiveStep(tabId);

  return (
    <ProgressWrapper>
      <section
        className={`${activeStep === 'connect_relay' ? `active` : `inactive`}`}
      >
        <h4>Select Relay Chain</h4>
      </section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>
      <section
        className={`${activeStep === 'reserve_para_id' ? `active` : `inactive`}`}
      >
        <h4>Reserve Para ID</h4>
      </section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>
      <section
        className={`${activeStep === 'configure_node' ? `active` : `inactive`}`}
      >
        <h4>Configure Node</h4>
      </section>
      <section className={`spacer inactive`}>
        <span className="connector"></span>
      </section>
      <section
        className={`${activeStep === 'register_parathread' ? `active` : `inactive`}`}
      >
        <h4>Register Parathread</h4>
      </section>
      <section
        className={`spacer ${activeStep !== 'get_coretime' ? `` : `inactive`}`}
      >
        <span className="connector"></span>
      </section>
      <section
        className={`${activeStep === 'get_coretime' ? `active` : `inactive`} last`}
      >
        <h4>Get Coretime</h4>
      </section>

      {activeStep === 'get_coretime' && (
        <section className="spacer smallOnly">
          <span className="connector"></span>
        </section>
      )}
    </ProgressWrapper>
  );
};

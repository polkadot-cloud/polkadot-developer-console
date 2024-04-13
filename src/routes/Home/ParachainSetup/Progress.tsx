// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTabId } from 'contexts/ActiveTab';
import { useParaSetup } from 'contexts/ParaSetup';
import { ProgressWrapper } from './Wrappers';

export const Progress = () => {
  const activeTabId = useActiveTabId();
  const { getActiveStep } = useParaSetup();
  const activeStep = getActiveStep(activeTabId);

  return (
    <ProgressWrapper>
      <section
        className={`${activeStep === 'reserve_para_id' ? `active` : ``}`}
      >
        <h4>Reserve Para ID</h4>
      </section>
      <section className="spacer">
        <span className="connector"></span>
      </section>
      <section className={`${activeStep === 'configure_node' ? `active` : ``}`}>
        <h4>Configure Node</h4>
      </section>
      <section className="spacer">
        <span className="connector"></span>
      </section>
      <section
        className={`${activeStep === 'register_parathread' ? `active` : ``}`}
      >
        <h4>Register Parathread</h4>
      </section>
      <section className="spacer">
        <span className="connector"></span>
      </section>
      <section className={`${activeStep === 'get_coretime' ? `active` : ``}`}>
        <h4>Get Coretime</h4>
      </section>
    </ProgressWrapper>
  );
};

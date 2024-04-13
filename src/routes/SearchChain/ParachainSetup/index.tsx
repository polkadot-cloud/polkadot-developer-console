// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper, ProgressWrapper, Wrapper } from './Wrappers';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { SetupStep } from 'contexts/ParaSetup/types';
import { setupSteps } from 'contexts/ParaSetup/defaults';
import { Footer } from './Footer';

export const ParachainSetup = () => {
  const activeTabId = useActiveTabId();
  const { getActiveStep } = useParaSetup();

  const activeStep = getActiveStep(activeTabId);

  // Get the next step in the setup process.
  const getNextStep = (): SetupStep | null => {
    const currentIndex = setupSteps.indexOf(activeStep);
    const nextStep = setupSteps[currentIndex + 1];
    return nextStep || null;
  };

  // Get the previous step in the setup process.
  const getPreviousStep = (): SetupStep | null => {
    const currentIndex = setupSteps.indexOf(activeStep);
    const prevStep = setupSteps[currentIndex - 1];
    return prevStep || null;
  };

  const next = getNextStep();
  const prev = getPreviousStep();

  return (
    <Wrapper>
      <h2>Set up a New Parachain</h2>

      <ProgressWrapper>
        <section
          className={`${activeStep === 'reserve_para_id' ? `active` : ``}`}
        >
          <h4>Reserve Para ID</h4>
        </section>
        <section className="spacer">
          <span className="connector"></span>
        </section>
        <section
          className={`${activeStep === 'configure_node' ? `active` : ``}`}
        >
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

      <FormWrapper>
        <h3>
          Reserve a Para ID on the Relay Chain you wish to secure blocks with.
        </h3>
      </FormWrapper>

      <Footer next={next} prev={prev} />
    </Wrapper>
  );
};

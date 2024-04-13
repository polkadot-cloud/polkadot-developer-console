// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper, Wrapper } from './Wrappers';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { SetupStep } from 'contexts/ParaSetup/types';
import { setupSteps } from 'contexts/ParaSetup/defaults';
import { Footer } from './Footer';
import { Progress } from './Progress';

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

      <Progress />

      {activeStep === 'reserve_para_id' && (
        <FormWrapper>
          <h3>
            Reserve a Para ID on the Relay Chain you wish to secure blocks with.
          </h3>
        </FormWrapper>
      )}

      {activeStep === 'configure_node' && (
        <FormWrapper>
          <h3>Configure your Parachain Node to connect to the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'register_parathread' && (
        <FormWrapper>
          <h3>Register your Parathread on the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'get_coretime' && (
        <FormWrapper>
          <h3>
            Get bulk or instantaneous Coretime and start processing blocks.
          </h3>
        </FormWrapper>
      )}

      <Footer next={next} prev={prev} />
    </Wrapper>
  );
};

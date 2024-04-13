// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FooterButtonWrapper,
  FooterWrapper,
  FormWrapper,
  ProgressWrapper,
  Wrapper,
} from './Wrappers';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { SetupStep } from 'contexts/ParaSetup/types';
import { setupSteps } from 'contexts/ParaSetup/defaults';

export const ParachainSetup = () => {
  const activeTabId = useActiveTabId();
  const { getActiveStep, setActiveStep } = useParaSetup();

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

      <FooterWrapper>
        <div></div>
        <div>
          <FooterButtonWrapper>
            <div className={`inner${!prev ? ` inactive` : ``}`}>
              <button
                onClick={() => {
                  if (prev) {
                    setActiveStep(activeTabId, prev);
                  }
                }}
                disabled={prev === null}
              >
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className="iconLeft"
                  transform="shrink-2"
                />
                Previous
              </button>
            </div>
          </FooterButtonWrapper>
          <FooterButtonWrapper>
            <div className={`inner${!next ? ` inactive` : ``}`}>
              <button
                onClick={() => {
                  if (next) {
                    setActiveStep(activeTabId, next);
                  }
                }}
                disabled={next === null}
              >
                Next
                <FontAwesomeIcon
                  icon={faCaretRight}
                  className="iconRight"
                  transform="shrink-2"
                />
              </button>
            </div>
          </FooterButtonWrapper>
        </div>
      </FooterWrapper>
    </Wrapper>
  );
};

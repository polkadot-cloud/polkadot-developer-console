// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FooterButtonWrapper, FooterWrapper } from './Wrappers';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import type { SetupStep } from 'contexts/ParaSetup/types';
import { setupSteps } from 'contexts/ParaSetup/defaults';

export const Footer = () => {
  const { tabId } = useActiveTab();
  const { getActiveStep, setActiveStep } = useParaSetup();

  const activeStep = getActiveStep(tabId);

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
    <FooterWrapper>
      <div></div>
      <div>
        <FooterButtonWrapper>
          <div className={`inner${!prev ? ` inactive` : ``}`}>
            <button
              onClick={() => {
                if (prev) {
                  setActiveStep(tabId, prev);
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
                  setActiveStep(tabId, next);
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
  );
};

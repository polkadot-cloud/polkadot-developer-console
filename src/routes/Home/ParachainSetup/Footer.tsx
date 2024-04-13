// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FooterButtonWrapper, FooterWrapper } from './Wrappers';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTabId } from 'contexts/ActiveTab';
import type { FooterProps } from './types';

export const Footer = ({ next, prev }: FooterProps) => {
  const activeTabId = useActiveTabId();
  const { setActiveStep } = useParaSetup();

  return (
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
  );
};

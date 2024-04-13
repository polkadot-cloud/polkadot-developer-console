// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FooterButtonWrapper,
  FooterWrapper,
  ProgressWrapper,
  Wrapper,
} from './Wrappers';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const ParachainSetup = () => (
  // const { getTab } = useTabs();
  // const activeTabId = useActiveTabId();

  // const tab = getTab(activeTabId);

  <Wrapper>
    <h2>Set up a New Parachain</h2>

    <ProgressWrapper>
      <section className="active">
        <h4>Reserve Para ID</h4>
      </section>
      <section className="spacer">
        <span className="connector"></span>
      </section>
      <section>
        <h4>Configure Node</h4>
      </section>
      <section className="spacer">
        <span className="connector"></span>
      </section>
      <section>
        <h4>Register Parathread</h4>
      </section>
      <section className="spacer">
        <span className="connector"></span>
      </section>
      <section>
        <h4>Get Coretime</h4>
      </section>
    </ProgressWrapper>

    <div>
      <h3>
        Reserve a Para ID on the Relay Chain you wish to secure blocks with.
      </h3>
    </div>

    <FooterWrapper>
      <div></div>
      <div>
        <FooterButtonWrapper>
          <div className="inner inactive">
            <button
              onClick={() => {
                /* Do nothing */
              }}
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
          <div className="inner">
            <button
              onClick={() => {
                /* Do nothing */
              }}
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

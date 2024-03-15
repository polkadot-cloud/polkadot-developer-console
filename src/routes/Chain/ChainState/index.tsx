// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectChainStateWrapper, Wrapper } from './Wrapper';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Header } from './Header';

export const ChainState = () => (
  <Wrapper>
    <Header />
    <SelectChainStateWrapper>
      <section>
        <h5>Pallet</h5>
        <button className="input">
          <span>
            <h4>Pallet Name</h4>
          </span>
          <span>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </button>
      </section>
      <section>
        <h5>Storage Item</h5>
        <button className="input">
          <span>
            <h4>Storage Item</h4>
          </span>
          <span>
            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </button>
      </section>
    </SelectChainStateWrapper>
  </Wrapper>
);

// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--background-default);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.4rem;
  min-height: 50px;
  display: flex;
  flex-flow: column wrap;
  padding: 0.25rem 0.75rem;
  width: 250px;
  font-size: 0.8rem;

  > button:last-child {
    border: none;
  }
`;

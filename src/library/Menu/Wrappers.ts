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

  > button:last-child {
    border: none;
  }
`;

export const ItemWrapper = styled.button`
  border-bottom: 1px solid var(--border-primary-color);
  color: var(--text-color-secondary);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0.75rem 0.5rem;
  width: 100%;

  &:hover {
    opacity: 0.75;
  }

  .title {
    color: var(--text-color-secondary);
    font-size: 1rem;
    padding: 0 0 0 0.75rem;
  }
`;

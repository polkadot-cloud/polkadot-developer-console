// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px solid var(--border-secondary-color);
  background: var(--background-default);
  border-radius: 0.4rem;
  display: flex;
  flex-flow: column wrap;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.07),
    0 2px 4px -2px rgba(0, 0, 0, 0.07);

  width: 256px;
`;

export const ListWrapper = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0.35rem;
  margin: 0;
  width: 100%;

  > li {
    font-family: Inter, sans-serif;
    padding: 0.55rem 0.5rem;
    font-size: 0.85rem;

    &:hover {
      background: var(--button-tab-background);
      border-radius: 0.35rem;
      cursor: pointer;
    }

    > .inner {
      display: flex;
      align-items: center;

      > div {
        &:nth-child(1) {
          color: var(--text-color-tertiary);
          margin-left: 0.25rem;
          margin-right: 0.25rem;
          display: flex;
          align-items: center;
          width: 1rem;
        }
        &:nth-child(2) {
          flex-grow: 1;

          > button {
            color: var(--text-color-secondary);
            text-align: left;
            width: 100%;
          }
        }
        &:nth-child(1),
        &:nth-child(3) {
          flex-shrink: 1;
        }
      }
    }
  }
`;

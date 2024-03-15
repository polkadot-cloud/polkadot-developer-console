// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
`;

export const SelectChainStateWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  padding-bottom: 0.8rem;
  margin-top: 1.5rem;
  width: 100%;

  > section {
    display: flex;
    flex-direction: column;

    &:first-child {
      flex-basis: 30%;
      padding-right: 0.4rem;
    }
    &:last-child {
      padding-left: 0.4rem;
      flex-grow: 1;
    }

    > h5 {
      margin-bottom: 0.2rem;
    }

    > .input {
      border: 1px solid var(--border-primary-color);
      background-color: var(--background-primary);
      border-radius: 0.4rem;
      padding: 0.5rem 0.6rem;
      display: flex;
      align-items: center;
      transition: border 0.15s;
      flex: 1;

      > span {
        display: flex;
        align-items: center;

        &:first-child {
          flex-grow: 1;
          > h4 {
            color: var(--text-color-primary);

            font-family: InterSemiBold, sans-serif;
            font-size: 0.85rem;
            margin: 0;
          }
        }
        &:last-child {
          color: var(--text-color-primary);
          justify-content: flex-end;
        }
      }

      &:hover {
        border-color: var(--border-secondary-color);
        > span:last-child {
          color: var(--accent-color-secondary);
        }
      }
    }
  }
`;

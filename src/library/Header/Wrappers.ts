// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  background-color: var(--background-default);
  display: flex;
  align-items: center;
  padding: 0.4rem 1.25rem 0.4rem 0.55rem;
  width: 100%;
  height: 2.4rem;

  > div {
    display: flex;
    align-items: center;
    flex-grow: 1;

    &:first-child {
      > h1 {
        color: var(--accent-color-secondary);
        font-family: Inter, sans-serif;
        font-size: 0.72rem;
        text-transform: uppercase;
        /* NOTE: Text gradients not yet standardised. Falls back to color on non-webkit compatible
        browsers. */
        background: linear-gradient(
          90deg,
          var(--accent-color-primary) 0%,
          var(--accent-color-primary) 40%,
          var(--accent-color-secondary) 100%
        );
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      > span {
        color: var(--text-color-primary);
        font-family: InterSemiBold, sans-serif;
        margin-left: 0.35rem;
        margin-right: 0.5rem;
        font-size: 0.7rem;
        opacity: 0.75;
      }
    }

    &:last-child {
      justify-content: flex-end;

      > button {
        opacity: 0.4;
        transition: opacity 0.2s;
        margin-left: 1.25rem;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

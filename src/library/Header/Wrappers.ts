// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  background-color: var(--background-default);
  display: flex;
  align-items: center;
  padding: 0.2rem 1.2rem 0.2rem 0.55rem;
  width: 100%;
  height: 2.1rem;

  > div {
    display: flex;
    align-items: center;
    flex-grow: 1;

    &:first-child {
      > span {
        color: var(--text-color-primary);
        margin: 0 0.5rem;
        position: relative;

        &.icon {
          width: 1rem;
          height: 1rem;
          top: -0.14rem;
          margin-left: 0;
        }

        &.logo {
          top: 0.1rem;
          margin: 0;
          display: flex;
          align-items: center;

          > svg {
            width: auto;
            height: 0.83rem;
          }
        }

        &.version {
          font-size: 0.7rem;
          opacity: 0.75;
          top: 0.05rem;
        }
      }
    }

    &:last-child {
      justify-content: flex-end;

      > button {
        color: var(--text-color-primary);
        opacity: 0.4;
        transition: opacity 0.2s;
        margin-left: 0.9rem;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

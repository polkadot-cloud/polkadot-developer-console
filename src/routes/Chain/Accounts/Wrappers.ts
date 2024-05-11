// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const AccountsWrapper = styled.div`
  --account-item-spacing: 0.75rem;

  flex: 1;
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding: 0 0.5rem;

  > section {
    display: flex;
    align-items: center;
    flex-basis: 33.33%;
    padding-bottom: var(--account-item-spacing);

    &:nth-child(3n - 2),
    &:nth-child(3n - 1) {
      padding-right: var(--account-item-spacing);
    }

    @media (max-width: 1100px) {
      flex-basis: 50%;

      &:nth-child(3n - 2),
      &:nth-child(3n - 1) {
        padding-right: 0;
      }
      &:nth-child(2n - 1) {
        padding-right: var(--account-item-spacing);
      }
    }

    @media (max-width: 700px) {
      flex-basis: 100%;

      &:nth-child(2n - 1) {
        padding-right: 0;
      }
    }

    > .inner {
      background-color: var(--background-default);
      border: 1px solid var(--border-secondary-color);
      box-shadow: var(--shadow-dropdown);
      border-radius: 0.5rem;
      display: flex;
      align-items: flex-start;
      padding: 0.85rem 0 0.5rem 0;
      flex: 1;

      > div {
        &.icon {
          padding-top: 0.15rem;
          padding-left: 0.75rem;
          flex: 0;
        }

        &.content {
          padding-left: 0.6rem;
          flex-grow: 1;
          position: relative;

          > .menu {
            position: absolute;
            top: -0.3rem;
            right: 0.6rem;
            z-index: 2;

            > button {
              color: var(--text-color-tertiary);
              background: var(--button-secondary-background);
              width: 1.2rem;
              height: 1.2rem;
              border-radius: 2rem;

              &:hover {
                color: var(--text-color-primary);
              }
            }
          }

          > .name {
            position: relative;
            height: 1.2rem;
          }

          > .address {
            position: relative;
            height: 0.9rem;
          }

          > .name > h3,
          > .address > h5 {
            margin: 0;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-right: 2.25rem;
          }

          > .name > h3 {
            color: var(--text-color-primary);
            font-size: 0.8rem;
            line-height: 0.95rem;
          }

          > .address > h5 {
            font-family: InterSemiBold, sans-serif;
            font-size: 0.72rem;
            padding-right: 1.5rem;

            > .copy {
              margin-left: 0.2rem;
              border-radius: 1rem;
              width: 1.2rem;
              height: 1.2rem;
              opacity: 0.6;

              &:hover {
                opacity: 1;
              }

              > svg {
                color: var(--text-color-tertiary);
              }
            }
          }

          > .free {
            border-top: 1px solid var(--border-primary-color);
            margin-top: 0.95rem;
            padding-top: 0.45rem;
            padding-right: 0.65rem;
            display: flex;
            justify-content: flex-end;

            > h5 {
              color: var(--text-color-secondary);
              font-family: InterSemiBold, sans-serif;
              font-size: 0.68rem;
              > span {
                opacity: 0.8;
              }
            }
          }
        }
      }
    }
  }
`;

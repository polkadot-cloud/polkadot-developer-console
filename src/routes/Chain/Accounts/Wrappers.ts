// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const AccountsWrapper = styled.div`
  --account-item-spacing: 0.75rem;

  flex: 1;
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;

  > section {
    display: flex;
    align-items: center;
    flex-basis: 33.33%;
    padding-bottom: var(--account-item-spacing);

    &:nth-child(3n - 2),
    &:nth-child(3n - 1) {
      padding-right: var(--account-item-spacing);
    }

    @media (max-width: 1000px) {
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
      border: 1px solid var(--border-primary-color);
      box-shadow: var(--shadow-dropdown);
      border-radius: 0.5rem;
      padding: 0.75rem 0.75rem;
      display: flex;
      align-items: center;
      flex: 1;

      > div {
        &.icon {
          flex: 0;
        }

        &.content {
          padding-left: 0.65rem;
          flex-grow: 1;

          > .name {
            position: relative;
            height: 1.1rem;
          }

          > .address {
            position: relative;
            height: 1.1rem;
            margin-top: 0.3rem;
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
          }

          > .address > h5 {
            font-size: 0.72rem;
            font-family: InterSemiBold, sans-serif;
          }
        }
      }
    }
  }
`;

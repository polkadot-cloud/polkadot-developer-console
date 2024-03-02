// Copyright 2024 @rossbulat/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  > label {
    border-radius: 100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    transition: background-color 0.2s;
    cursor: pointer;
    width: inherit;
    height: inherit;

    &.is-disabled {
      transition:
        opacity 0.15s,
        color 0.15s;

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }

    &.is-enabled {
      cursor: pointer;
    }
  }

  > label > input {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  > label > .btn {
    content: '';
    position: absolute;
    border-radius: 100rem;
    transition: 0.3s;
    box-shadow: 0 0 0.1rem 0 rgb(10 10 10 / 10%);
    top: 0.13rem;
    left: 0.23rem;
    width: 1.1rem;
    height: 1.1rem;

    &.is-disabled {
      transition:
        opacity 0.15s,
        color 0.15s;

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }
  }

  > label:active > .btn {
    &.is-enabled {
      width: 1.5rem;
    }

    &.is-disabled {
      width: 1.2rem;
    }
  }
`;

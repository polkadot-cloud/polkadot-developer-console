// Copyright 2024 @rossbulat/polkadot-live-app authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.span`
  > label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 100rem;
    position: relative;
    transition: background-color 0.2s;

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

    &.sm {
      width: 3rem;
      height: 1.5rem;
    }

    &.lg {
      width: 4.5rem;
      height: 2.25rem;
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
    top: 0.15rem;
    left: 0.2rem;
    width: 1.6rem;
    height: 1.6rem;

    &.is-disabled {
      transition:
        opacity 0.15s,
        color 0.15s;

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }

    &.sm {
      top: 0.13rem;
      left: 0.23rem;
      width: 1.1rem;
      height: 1.1rem;
    }

    &.lg {
      top: 0.16rem;
      left: 0.25rem;
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  > label > input:checked + .btn {
    left: calc(100% - 0.2rem);
    transform: translateX(-100%);
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

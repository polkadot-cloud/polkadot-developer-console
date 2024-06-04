// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const DisplayWrapper = styled.div`
  .ui--qr-Display {
    height: 100%;
    width: 100%;

    img,
    svg {
      background: white;
      height: auto !important;
      max-height: 100%;
      max-width: 100%;
      width: auto !important;
    }
  }
`;

export const ScanWrapper = styled.div`
  .ui--qr-Scan {
    display: inline-block;
    height: 100%;
    transform: matrix(-1, 0, 0, 1, 0, 0);
    width: 100%;

    video {
      margin: 0;
    }
  }
`;

export const QRViewerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1.25rem 0.5rem 0 0.5rem;

  .title {
    color: var(--accent-color-primary);
    font-family: InterBold, sans-serif;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .progress {
    border-radius: 0.5rem;
    background: var(--background-menu);
    padding: 0.4rem 1.5rem 0rem 1rem;

    span {
      opacity: 0.4;
      font-size: 0.85rem;

      &.active {
        opacity: 1;
      }
    }
    .arrow {
      margin: 0 0.85rem;
    }
  }

  .viewer {
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    height: 300px;

    &.scan {
      width: 325px;
    }
  }

  .foot {
    border-top: 1px solid var(--border-primary-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
    padding: 0.9rem 0.5rem;
    width: 100%;

    > div {
      display: flex;
      justify-content: center;
      width: 100%;

      > button {
        font-size: 0.9rem;
        margin: 0 0.7rem;
        &:last-child {
          font-size: 0.8rem;
        }

        > svg {
          margin: 0 0.1rem;
        }
      }
    }
  }
`;

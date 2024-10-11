// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components';

// Wrapper for the progress bar that shows the current step in the setup process.
export const ProgressWrapper = styled.div`
  --progress-vertical-padding: 1rem;

  @media (max-width: 850px) {
    --progress-vertical-padding: 0.5rem;
  }

  flex: 1;
  margin-bottom: 1.35rem;
  display: flex;

  > section {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem var(--progress-vertical-padding) 0.5rem
      var(--progress-vertical-padding);
    align-items: flex-start;

    &.label {
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    &:first-child {
      padding-left: 0;
    }

    &:last-child,
    &.last {
      padding-right: 0;
    }

    &.spacer {
      padding-left: 0.5rem;
      flex-grow: 1;
    }

    > h4 {
      color: var(--text-color-tertiary);
      font-family: InterSemiBold, sans-serif;
      transition: color 0.15s;

      > svg {
        margin-right: 0.25rem;
      }
    }

    > .status {
      background-color: var(--background-default);
      border: 1px solid var(--text-color-tertiary);
      border-radius: 0.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.45rem;
      width: 100%;
      height: 1.6rem;
      overflow: hidden;
      opacity: 0.75;

      &.active {
        opacity: 1;
        border-color: var(--accent-color-primary);
      }

      &.collapsed {
        border-color: transparent;
        height: 0;
      }
      &.hidden {
        border-color: transparent;
        opacity: 0;
      }

      @media (max-width: 850px) {
        display: none;
      }
    }

    > .connector {
      border-top: 1px solid var(--border-secondary-color);
      width: 100%;
      margin-top: 0.65rem;
      height: 1px;
    }

    &.active {
      h4 {
        color: var(--accent-color-primary);
      }
    }

    @media (max-width: 850px) {
      &.inactive {
        display: none;
      }
      &.smallOnly {
        display: flex;
        padding-left: 1rem;
      }
    }

    @media (min-width: 851px) {
      &.smallOnly {
        display: none;
      }
    }
  }
`;

export const ProgressBadgeWrapper = styled.div`
  margin-left: 0.6rem;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0.2rem;
  transition: opacity 0.2s;

  > div {
    width: 100%;
    height: 100%;
    position: relative;

    > svg {
      fill: var(--text-color-tertiary);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &.active {
    > div > svg {
      fill: var(--accent-color-primary);
    }
  }
`;

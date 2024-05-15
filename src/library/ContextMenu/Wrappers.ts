// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  width: 256px;

  &.large {
    width: 320px;
  }

  > .inner {
    box-shadow: var(--shadow-floating-menu);
    border: 1px solid var(--border-secondary-color);
    background: var(--background-default);
    border-radius: 0.4rem;
    display: flex;
    flex-flow: column wrap;
    width: 100%;
  }
`;

export const ListWrapper = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0.2rem 0.35rem 0.2rem 0.35rem;
  margin: 0;
  width: 100%;

  > li {
    font-family: Inter, sans-serif;
    padding: 0.55rem 0.5rem;
    font-size: 0.85rem;
    margin: 0.12rem 0;
    position: relative;

    > button {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;

      &:disabled {
        cursor: default;
      }
    }

    > .inner {
      display: flex;
      align-items: center;

      > div {
        overflow: hidden;

        &:nth-child(1) {
          color: var(--text-color-tertiary);
          margin-left: 0.25rem;
          margin-right: 0.25rem;
          display: flex;
          align-items: center;
          width: 1rem;

          &.none {
            width: 0;
          }

          > .svg {
            width: 0.9rem;
            height: 0.9rem;
          }
        }
        &:nth-child(2) {
          flex-grow: 1;
          flex-basis: 60%;

          > h3 {
            color: var(--text-color-secondary);
            font-size: 0.8rem;
            text-align: left;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;

            &.inactive {
              color: var(--text-color-tertiary);
              opacity: 0.6;
            }
          }
        }
        &:nth-child(1),
        &:nth-child(3) {
          flex-shrink: 1;
        }

        &:nth-child(3) {
          color: var(--text-color-tertiary);
          justify-content: flex-end;
          padding-left: 0.5rem;

          &.inactive {
            opacity: 0.6;
          }

          h5 {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }

    &:hover {
      background: var(--button-tab-background);
      color: var(--text-color-primary);
      border-radius: 0.3rem;
      cursor: pointer;

      &.inactive {
        background: none;
        cursor: default;
        > button {
          cursor: default;
        }
      }

      > .inner {
        > div > h3,
        > div > button {
          color: var(--text-color-primary);
        }
      }
    }

    &.selected {
      > .inner {
        > div > h3,
        > div > h3 {
          color: var(--text-color-primary);
        }
      }
    }

    &.disabled {
      opacity: 0.5;

      > .inner {
        > div > h3,
        > div > button {
          color: var(--text-color-tertiary);
        }
      }

      &:hover {
        background-color: transparent;
      }
    }
  }
`;

export const SelectListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 450px;
  width: 100%;

  > h5 {
    padding: 0.75rem 0.75rem 0 0.75rem;

    &.inline {
      padding: 0.25rem 0.75rem 0 0.75rem;
    }
  }
`;

export const SearchWrapper = styled.div`
  background-color: var(--background-default);
  position: sticky;
  padding: 0.2rem 0.3rem 0 0.2rem;
  top: 0;
  width: 100%;
  z-index: 5;
  display: flex;
  align-items: center;

  > .input {
    border: 1px solid var(--border-primary-color);
    padding: 0.3rem 0.4rem;
    border-radius: 0.25rem;
    margin: 0.3rem 0;
    flex-grow: 1;
    display: flex;
    position: relative;

    > input {
      margin: 0;
      padding: 0;
      flex-grow: 1;
      font-size: 0.7rem;
      padding-right: 1.35rem;
    }

    > .delete {
      color: var(--text-color-tertiary);
      position: absolute;
      top: 0.25rem;
      right: 0.35rem;

      &:hover {
        color: var(--accent-color-primary);
      }

      .fa-secondary {
        opacity: 0.25;
      }
    }
  }

  > .icon {
    color: var(--text-color-tertiary);
    margin-left: 0.6rem;

    &.active {
      color: var(--accent-color-primary);
    }
  }

  &.bg {
    > input {
      background: var(--background-primary);
    }
  }
`;

export const HelpWrapper = styled.div`
  width: 100%;
  padding: 0.75rem;

  h4 {
    color: var(--accent-color-primary);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;

    > svg {
      margin-right: 0.35rem;
    }
  }

  p {
    color: var(--text-color-primary);
    font-size: 0.8rem;
    line-height: 1.2rem;
    margin: 0;
  }

  > button {
    background: var(--accent-color-primary);
    color: var(--text-color-invert);
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 0.75rem;
  }
`;

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  border: 1px solid var(--border-secondary-color);
  background: var(--background-default);
  border-radius: 0.4rem;
  display: flex;
  flex-flow: column wrap;
  /* TODO: make theme variable + dark mode support */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.07),
    0 2px 4px -2px rgba(0, 0, 0, 0.07);

  width: 256px;
`;

export const ListWrapper = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0.35rem;
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
        &:nth-child(1) {
          color: var(--text-color-tertiary);
          margin-left: 0.25rem;
          margin-right: 0.25rem;
          display: flex;
          align-items: center;
          width: 1rem;
        }
        &:nth-child(2) {
          flex-grow: 1;

          > h3 {
            color: var(--text-color-secondary);
            font-size: 0.8rem;
            text-align: left;
            width: 100%;
          }
        }
        &:nth-child(1),
        &:nth-child(3) {
          flex-shrink: 1;
        }
      }
    }

    &:hover {
      background: var(--button-tab-background);
      color: var(--text-color-primary);
      border-radius: 0.3rem;
      cursor: pointer;

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

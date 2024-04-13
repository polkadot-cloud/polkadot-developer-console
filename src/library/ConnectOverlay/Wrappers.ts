// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  --connect-item-height: 3.4rem;

  width: 100%;
  max-width: 500px;

  > .inner {
    box-shadow: var(--shadow-floating-menu);
    border: 1px solid var(--border-secondary-color);
    background: var(--background-default);
    border-radius: 0.4rem;
    display: flex;
    flex-flow: column wrap;
    padding: 0.75rem;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;

    > h3 {
      color: var(--text-color-tertiary);
      margin-bottom: 0.35rem;

      > svg {
        margin-right: 0.4rem;
      }
    }

    > h4 {
      font-family: InterBold, sans-serif;
      margin: 0.5rem 0;
    }

    > div {
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

export const ItemWrapper = styled.div`
  background-color: var(--background-default);
  border: 1px solid var(--border-secondary-color);
  border-radius: 0.5rem;
  flex: 1;
  padding: 0 0.6rem;
  display: flex;
  align-items: center;

  > div {
    height: var(--connect-item-height);
    display: flex;
    align-items: center;

    &:first-child {
      height: var(--connect-item-height);
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.15rem;
      max-width: 2.15rem;
      height: 100%;

      > .icon {
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    &:last-child {
      flex-grow: 1;
      display: flex;
      padding-left: 0.5rem;

      > div {
        &:first-child {
          flex-grow: 1;

          > h4,
          > h5 {
            display: flex;
            align-items: center;
          }

          > h4 {
            font-family: InterSemiBold, sans-serif;
            line-height: 0.85rem;
            margin-bottom: 0.25rem;
          }

          > h5 {
            color: var(--text-color-tertiary);
            font-family: InterSemiBold, sans-serif;

            > a {
              color: var(--text-color-tertiary);
              text-decoration: none;
              display: flex;
              align-items: center;

              > svg {
                margin-left: 0.15rem;
              }
            }
          }
        }
        &:last-child {
          padding-right: 0.25rem;

          > button {
            color: var(--accent-color-secondary);
            font-family: InterSemiBold, sans-serif;
            font-size: 0.75rem;
          }
        }
      }
    }
  }
`;

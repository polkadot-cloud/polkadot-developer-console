// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &.margin {
    margin-top: 0.25rem;
  }

  > .inner {
    border-top: 1px solid var(--border-primary-color);
    background: var(--background-modal-footer);
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0.75rem 0.6rem 0.75rem;

    &.canvas {
      background: var(--background-canvas-card);
    }

    &.card {
      border-radius: 0.5rem;
    }

    > section {
      width: 100%;

      > .inner {
        display: flex;
        flex-direction: row;
        align-items: center;

        &.col {
          flex-direction: column;
          margin-top: 0.5rem;

          > div {
            width: 100%;
            margin-bottom: 0.4rem;

            > div,
            > p {
              margin-bottom: 0.4rem;
              width: 100%;
            }

            > div:last-child {
              margin-bottom: 0;
            }
          }
        }

        > div {
          display: flex;

          &:first-child {
            flex-direction: column;
            justify-content: center;
            flex-grow: 1;

            p {
              color: var(--text-color-secondary);
              display: flex;
              align-items: center;
              font-size: 0.75rem;
              margin: 0;
              padding-left: 0.25rem;

              &.prompt {
                color: var(--accent-color-primary);
                font-size: 0.75rem;
                align-items: flex-start;

                .icon {
                  margin-top: 0.16rem;
                  margin-right: 0.5rem;
                }
              }
            }
          }

          &:last-child {
            button {
              margin: 0 0.25rem 0.25rem 0.75rem;
            }
          }
        }

        &.warning {
          margin-top: 1rem;
          margin-bottom: 0.25rem;
          padding: 0.5rem 0;
        }

        &.msg {
          border-top: 1px solid var(--border-primary-color);
          padding: 0.5rem 0;
          margin-top: 0.25rem;
        }
      }
    }
  }
`;

export const SignerWrapper = styled.p`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  padding-bottom: 0.25rem;
  margin: 0;

  .badge {
    color: var(--text-color-secondary);
    border: 1px solid var(--border-secondary-color);
    border-radius: 0.45rem;
    padding: 0rem 0.4rem;
    margin-right: 0.5rem;

    > svg {
      margin-right: 0.35rem;
    }
  }

  .not-enough {
    margin-left: 0.5rem;

    > .danger {
      color: var(--status-danger-color);
    }

    > .icon {
      margin-right: 0.3rem;
    }
  }
`;

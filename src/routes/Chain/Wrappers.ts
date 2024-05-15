// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const StatsWrapper = styled.div`
  font-family: InterSemiBold, sans-serif;
  color: var(--text-color-secondary);
  display: flex;
  margin-top: 0.25rem;
  flex: 1;

  &.vSpace {
    margin-top: 0.75rem;
  }

  > div {
    margin-right: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.8rem;

    &.active {
      color: var(--accent-color-secondary);
    }

    > .icon {
      fill: var(--accent-color-secondary);
      margin-right: 0.25rem;
      width: 0.7rem;
      height: 0.7rem;
    }

    > span {
      color: var(--text-color-tertiary);
      font-size: 0.7rem;
      margin-right: 0.3rem;
    }
  }
`;

export const InputFormWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  margin-top: 0.5rem;
  padding: 0 0.25rem 0.75rem 0.25rem;
  overflow: visible;
  width: 100%;

  section {
    flex: 1;
    padding: 0.3rem 0 0 0;
    width: 100%;

    &.footer {
      display: flex;
      flex-direction: row;
      margin-top: 0.5rem;
      justify-content: flex-end;

      > button:disabled {
        color: var(--text-color-tertiary);
        cursor: default;
        opacity: 0.5;
      }
    }

    &.indent {
      padding-left: 1.25rem;
    }

    > .inner {
      display: flex;
      flex-flow: column wrap;
      position: relative;
      width: 100%;

      > h4 {
        margin: 0rem 0 0.3rem 0;
        padding: 0 0.25rem;

        &.marginTop {
          margin-top: 0.25rem;
        }
      }
    }
  }
`;

export const SequenceItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  > div {
    display: flex;
    flex-direction: row;

    &:first-child {
      flex-grow: 1;
    }
    &:last-child {
      flex-shrink: 1;
      padding-left: 0.65rem;
      padding-bottom: 0.8rem;
      > button {
        color: var(--text-color-tertiary);
      }
    }
  }
`;

export const AddInputWrapper = styled.div`
  margin-top: 0.5rem;
  padding-left: 1.25rem;
  width: 100%;

  > button {
    color: var(--text-color-tertiary);
  }
`;

export const EncodedWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  > .module {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    max-width: 450px;

    @media (max-width: 750px) {
      max-width: none;
    }

    > section {
      display: flex;
      align-items: center;
      padding: 0.3rem 0.4rem;

      > div {
        display: flex;
        padding-bottom: 0.3rem;

        &:first-child {
          padding-right: 0.75rem;
          min-width: 4rem;
          justify-content: flex-end;

          > h5 {
            font-family: InterSemiBold, sans-serif;
            color: var(--text-color-secondary);
          }
        }
        &:last-child {
          border-bottom: 1px solid var(--border-secondary-color);
          flex-grow: 1;

          > h4 {
            font-family: InterSemiBold, sans-serif;
            color: var(--text-color-tertiary);
            display: flex;
            align-items: center;
            flex-grow: 1;

            > button {
              color: var(--text-color-secondary);
              display: flex;
              justify-content: flex-end;
              flex-grow: 1;
              margin-left: 0.65rem;
              transition: opacity 0.15s;
              opacity: 0.6;

              &:hover {
                color: var(--text-color-primary);
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
`;

export const ChainStateResultWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 0.75rem;
  padding: 0 0.25rem;

  > section {
    flex: 1;
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.75rem;

    > .inner {
      flex: 1;
      border: 0.5px solid var(--border-secondary-color);
      background-color: var(--background-default);
      border-radius: 0.4rem;
      padding: 0.6rem 0.7rem;
      flex-direction: column;

      > .header {
        flex: 1;
        position: relative;
        width: 100%;
        overflow: hidden;
        height: 1.05rem;

        > h5 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          font-family: InterSemiBold, sans-serif;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin-right: 3rem;
        }
      }

      > .value {
        margin-top: 0.6rem;
        display: flex;

        > div {
          display: flex;
          align-items: center;

          &:first-child {
            flex: 1;
            > h4 {
              flex: 1;
              margin: 0;
              color: var(--text-color-secondary);
              font-family: InterSemiBold, sans-serif;
            }
          }

          &:last-child {
            padding-left: 0.75rem;

            > button {
              color: var(--text-color-tertiary);
            }
          }
        }
      }
    }

    > .dismiss {
      padding-left: 0.6rem;
      display: flex;
      flex-direction: column;
      justify-content: center;

      > button {
        margin: 0.3rem 0;
        opacity: 0.4;
        transition: opacity 0.15s;
        font-size: 0.9rem;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

export const FilterWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;

  > button {
    color: var(--text-color-tertiary);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.75rem;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    padding: 0 0.3rem;

    &:hover {
      color: var(--text-color-secondary);
    }

    &.active {
      color: var(--accent-color-secondary);
      &:hover {
        color: var(--accent-color-secondary);
      }
    }

    > svg {
      margin-left: 0.3rem;
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

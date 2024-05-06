// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SelectFormWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  overflow: visible;

  &.withHeader {
    margin-top: 1.5rem;
  }

  > section {
    display: flex;
    flex-direction: column;
    position: relative;

    > .inner {
      display: flex;
      flex-direction: column;

      > h5 {
        margin-bottom: 0.25rem;
      }
    }

    &:first-child {
      flex-basis: 25%;
      > .inner,
      > .inner > div {
        width: calc(100% - 0.75rem);
      }
    }

    &:last-child {
      flex-grow: 1;
      max-width: 75%;
      width: 100%;
    }

    &.singular {
      flex-basis: 100%;
      min-width: 100%;
      width: 100%;
      > .inner,
      > .inner > div {
        width: 100%;
      }
    }
  }
`;

export const SelectWrapper = styled.span`
  position: relative;
  > h4 {
    margin-bottom: 0.2rem;
  }
`;

export const SelectItemWrapper = styled.button`
  width: 100%;
  min-height: 2.7rem;

  &.standalone {
    border: 1px solid var(--border-primary-color);
    background-color: var(--background-primary);
    border-radius: 0.4rem;
    transition: border 0.15s;

    &:hover {
      border-color: var(--border-secondary-color);
      > span:last-child {
        color: var(--accent-color-secondary);
      }
    }

    &.open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &.option {
    border-bottom: 1px solid var(--border-primary-color);
    transition: background-color 0.15s;

    &.selected {
      background-color: var(--button-primary-background);
    }

    &:hover {
      background-color: var(--button-primary-background);
    }
  }

  &.input {
    background-color: var(--background-default);
    border: 1px solid var(--border-secondary-color);
    border-radius: 0.25rem;

    &.disabled {
      background-color: var(--background-default);
      border-color: var(--border-primary-color);

      /* Overwrite the right span icon hover color */
      > span:last-child {
        color: var(--text-color-tertiary);
      }
    }
  }

  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 0.7rem;

  > span {
    display: flex;
    align-items: center;

    > .icon {
      width: 0.95rem;
      height: 0.95rem;
      margin-right: 0.6rem;

      > svg {
        fill: var(--text-color-secondary);
      }
    }

    &:first-child {
      flex-grow: 1;
      flex-basis: 40%;
      padding-right: 1rem;
      overflow: hidden;
    }
    &:last-child {
      color: var(--text-color-primary);
      overflow: hidden;
      flex-basis: 20%;
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;

      > h5 {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: right;
        width: 100%;
      }

      > svg {
        margin-left: 0.4rem;
      }
    }
  }
`;

export const SelectDropdownWrapper = styled.div`
  background: var(--background-primary);
  border: 1px solid var(--border-primary-color);
  box-shadow: var(--shadow-dropdown);
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  flex-direction: column;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  border-top: none;
  display: none;

  &.open {
    display: flex;
  }
`;

export const SelectTextWrapper = styled.h4`
  color: var(--text-color-primary);

  font-family: InterSemiBold, sans-serif;
  font-size: 0.85rem;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  > span {
    color: var(--text-color-secondary);
    font-family: Inter, sans-serif;
    margin-left: 0.1rem;
  }

  &.secondary {
    color: var(--text-color-secondary);
    font-size: 0.8rem;

    > span {
      color: var(--text-color-tertiary);
    }
  }
`;

export const TextInputWrapper = styled.div`
  height: 2.7rem;
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  border-radius: 0.4rem;
  transition: border 0.15s;
  display: flex;
  align-items: center;

  &:hover {
    border-color: var(--border-secondary-color);
    > span:last-child {
      color: var(--accent-color-secondary);
    }
  }

  .icon {
    position: relative;
    left: 0.5rem;
    padding-right: 0.15rem;
  }

  > input,
  > .deadInput {
    font-family: InterSemiBold, sans-serif;
    height: inherit;
    padding: 0 0.7rem;
    width: 100%;
    text-align: left;
  }

  &.input {
    background-color: var(--background-default);
    border: 1px solid var(--border-secondary-color);
    border-radius: 0.25rem;

    &:hover {
      border-color: var(--accent-color-secondary);
    }

    > input,
    > .deadInput {
      color: var(--text-color-secondary);
      font-size: 0.8rem;
    }
  }

  > span {
    &:last-child {
      padding: 0 0.75rem;
    }
  }
`;

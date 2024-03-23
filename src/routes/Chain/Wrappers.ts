// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SelectFormWrapper = styled.div`
  --select-item-height: 2.8rem;

  border-bottom: 1px solid var(--border-primary-color);
  flex: 1;
  display: flex;
  flex-flow: row wrap;
  padding-bottom: 0.85rem;
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

    &.footer {
      display: flex;
      flex-direction: row;
      margin-top: 0.75rem;
      justify-content: flex-end;
    }
  }
`;

export const SelectItemWrapper = styled.button`
  min-height: var(--select-item-height);

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

  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 0.7rem;

  > span {
    display: flex;
    align-items: center;

    &:first-child {
      flex-grow: 1;
      flex-basis: 40%;
      padding-right: 1rem;
      overflow: hidden;
    }
    &:last-child {
      color: var(--text-color-primary);
      justify-content: flex-end;
      overflow: hidden;

      > h5 {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  flex-direction: column;
  max-height: 350px;
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
`;

export const TextInputWrapper = styled.div`
  height: var(--select-item-height);

  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  border-radius: 0.4rem;
  transition: border 0.15s;
  display: flex;

  &:hover {
    border-color: var(--border-secondary-color);
    > span:last-child {
      color: var(--accent-color-secondary);
    }
  }

  > input {
    font-family: InterSemiBold, sans-serif;
    height: inherit;
    padding: 0 0.7rem;
    width: 100%;
  }
`;

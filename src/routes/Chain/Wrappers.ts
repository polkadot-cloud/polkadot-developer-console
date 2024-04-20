// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const FlexWrapper = styled.div`
  flex: 1;
`;

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

export const SelectFormWrapper = styled.div`
  --select-item-height: 2.8rem;

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

  &.input {
    background-color: var(--background-default);
    border: 1px solid var(--border-secondary-color);
    border-radius: 0.25rem;

    &:hover {
      border-color: var(--accent-color-secondary);
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

  &.secondary {
    color: var(--text-color-secondary);
    font-size: 0.8rem;

    > span {
      color: var(--text-color-tertiary);
    }
  }
`;

export const TextInputWrapper = styled.div`
  height: var(--select-item-height);
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

  .polkicon {
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
`;

export const InputFormWrapper = styled.div`
  --select-item-height: 2.65rem;

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

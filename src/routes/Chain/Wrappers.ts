// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const SelectFormWrapper = styled.div`
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

    &:first-child {
      flex-basis: 25%;
      margin-right: 0.4rem;
    }
    &:last-child {
      margin-left: 0.4rem;
      flex-grow: 1;
    }

    > h5 {
      margin-bottom: 0.25rem;
    }
  }
`;

export const SelectItemWrapper = styled.button`
  &.standalone {
    border: 1px solid var(--border-primary-color);
    background-color: var(--background-primary);
    border-radius: 0.4rem;
    transition: border 0.15s;

    &.open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &.option {
    border-bottom: 1px solid var(--border-primary-color);
    transition: background-color 0.15s;
  }

  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.7rem;

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
    }
  }

  &:hover {
    border-color: var(--border-secondary-color);
    > span:last-child {
      color: var(--accent-color-secondary);
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
  max-height: 250px;
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

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const TabsWrapper = styled.div`
  --tab-height: 2rem;
  --tab-border-radius: 0.35rem;

  background-color: var(--background-list-item);
  border-top: 1px solid var(--border-secondary-color);
  border-bottom: 1px solid var(--border-secondary-color);
  border-image: linear-gradient(45deg, #c3c3c3, #e6e6e6) 50;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-style: solid;
  display: flex;
  padding: 0.25rem 0rem 0.25rem 0.3rem;
  overflow-x: auto;
  width: 100%;

  /* Hide scrollbar. */

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const TabWrapper = styled(motion.div)`
  border-right: 1px solid var(--border-secondary-color);
  color: var(--text-color-tertiary);
  height: var(--tab-height);
  font-size: 0.8rem;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  margin-right: 0.1rem;
  cursor: pointer;
  overflow: hidden;
  transition:
    background-color 0.15s,
    border 0.3s,
    position 0.2s;

  &:hover,
  &.active,
  &:active {
    background-color: var(--button-tab-background);
    border-right-color: var(--background-default);
    border-radius: var(--tab-border-radius);
    color: var(--text-color-primary);
  }

  &:active {
    z-index: 5;
  }

  &.hide-border {
    border-right-color: var(--background-default);
  }

  &.action {
    color: var(--text-color-primary);
    margin-left: 0.2rem;
    padding: 0 0.75rem;
    min-width: auto;
    border-right: none;

    &.last {
      margin-left: 0;
    }
  }

  /* Hide element and ensure below drag element. */

  &.dragging {
    z-index: 3;
    opacity: 0;
  }

  /* Main tab elements. */

  > .icon {
    margin-right: 0.25rem;
  }

  > .name {
    height: var(--tab-height);
    color: inherit;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 0.75rem;
    display: flex;
    align-items: center;
    /* Handle text overflow */
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
  }

  > .drag {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* Close button. */

  > .close {
    color: var(--text-color-secondary);
    position: absolute;
    top: 0;
    right: 0;
    height: inherit;
    padding-right: 0.4rem;
    opacity: 0;
    z-index: 4;
  }

  &:hover,
  &.active {
    .close {
      opacity: 1;
    }
  }

  /* Fade for cosmetic text clipping. */

  > .fade {
    /* TODO: abstract these gradients into theme variable. */
    background: linear-gradient(
      90deg,
      rgba(239, 238, 238, 0) 0%,
      rgba(239, 238, 238, 1) 70%,
      rgba(239, 238, 238, 1) 100%
    );
    border-top-right-radius: var(--tab-border-radius);
    border-bottom-right-radius: var(--tab-border-radius);
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 2rem;
    z-index: 4;
  }

  &:hover,
  &.active,
  &:active {
    > .fade {
      background: linear-gradient(
        90deg,
        rgba(228, 226, 226, 0) 0%,
        rgba(228, 226, 226, 1) 50%,
        rgba(228, 226, 226, 1) 100%
      );
    }
  }
`;

export const ControlsWrapper = styled.div`
  background-color: var(--background-list-item);
  color: var(--text-color-tertiary);
  height: var(--tab-height);
  display: flex;
  align-items: center;
  flex-grow: 1;
  font-size: 0.8rem;
  position: sticky;
  right: 0rem;
  z-index: 5;
  padding-right: 0.25rem;

  > div {
    &:last-child {
      display: flex;
      justify-content: flex-end;
      flex: 1;
    }
  }
`;

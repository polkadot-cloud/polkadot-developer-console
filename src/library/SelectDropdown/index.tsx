// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SelectDropdownProps } from './types';
import { useEffect, useRef } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { SelectDropdownWrapper } from 'library/Inputs/Wrappers';

export const SelectDropdown = ({
  open,
  children,
  heightRef,
  className,
  onOutsideClick,
  outsideAlerterIgnore,
}: SelectDropdownProps) => {
  // Dropdown container ref.
  const ref = useRef<HTMLDivElement>(null);

  // Hard cap on the max height of dropdown.
  const HardMaxHeight = 450;

  // Padding between edge of window and dropdown container.
  const DropdownPadding = 15;

  // Sync dropdown height to fit inside window.
  const syncWindowHeight = () => {
    const refY = ref.current?.getBoundingClientRect().top || 0;

    // If a height ref has been provided, calculate max height based on its container.
    let initialMaxHeight;

    if (heightRef?.current) {
      const heightRefBottom =
        heightRef.current?.getBoundingClientRect().bottom || 0;

      initialMaxHeight = Math.max(heightRefBottom - refY, 0);
    }

    // Calculate max height for refY.
    let maxHeight = Math.max(
      (initialMaxHeight || window.innerHeight - refY) - DropdownPadding,
      0
    );

    // Hard cap on max height.
    maxHeight = Math.min(maxHeight, HardMaxHeight);

    // Set max height for ref. Needs to be initialised.
    if (ref?.current) {
      ref.current.style.maxHeight = `${maxHeight}px`;
    }
  };

  // Handler for closing the overlay on window resize.
  const resizeCallback = () => {
    if (open) {
      syncWindowHeight();
    }
  };

  // Close dropdown if clicked outside of its container.
  useOutsideAlerter(
    ref,
    () => {
      onOutsideClick?.();
    },
    outsideAlerterIgnore ? [...outsideAlerterIgnore] : []
  );

  // Sync dropdown height on initial render and on open state.
  useEffect(() => {
    // Ensure dropdown fits in window display.
    if (open) {
      syncWindowHeight();
    }
  }, [open]);

  // Close the overlay on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    <SelectDropdownWrapper
      ref={ref}
      className={`${open ? `open` : ``}${className ? ` ${className}` : ``}`}
    >
      {children}
    </SelectDropdownWrapper>
  );
};

SelectDropdown.displayName = 'SelectDropdown';

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectDropdownWrapper } from 'routes/Chain/Wrappers';
import type { SelectDropdownProps } from './types';
import { useRef } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';

export const SelectDropdown = ({
  open,
  children,
  className,
  onOutsideClick,
  outsideAlerterIgnore,
}: SelectDropdownProps) => {
  // Dropdown container ref.
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside of its container.
  useOutsideAlerter(
    ref,
    () => {
      onOutsideClick?.();
    },
    outsideAlerterIgnore ? [...outsideAlerterIgnore] : []
  );

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

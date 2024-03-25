// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef, useState } from 'react';
import {
  SelectDropdownWrapper,
  SelectItemWrapper,
  SelectTextWrapper,
} from '../Wrappers';
import { camelize } from '@w3ux/utils';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Select = ({
  values,
  label,
}: {
  values: string[];
  label: string | number;
}) => {
  // Whether select options are open.
  const [open, setOpen] = useState<boolean>(false);

  // Refs for the selection menu.
  const selectRef = useRef(null);

  // Outside alerter ignore class.
  const ignoreClass = `ignore-outside-alerter-select_${camelize(String(label))}`;

  // Close selection menu if clicked outside of its container.
  useOutsideAlerter(
    selectRef,
    () => {
      setOpen(false);
    },
    [ignoreClass]
  );

  return (
    <>
      <h5>{label}</h5>
      <SelectItemWrapper
        className={`standalone input${open ? ` open` : ``} ${ignoreClass}`}
        onClick={() => setOpen(!open)}
      >
        <span>
          <SelectTextWrapper>{values[0] || `No Values`}</SelectTextWrapper>
        </span>
        <span>
          <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
        </span>
      </SelectItemWrapper>

      {open && (
        <SelectDropdownWrapper
          ref={selectRef}
          className={`${open ? `open` : ``}`}
        >
          {values.map((val) => (
            <SelectItemWrapper
              key={`select_${label}_${camelize(val)}`}
              className={`option`}
              onClick={() => {
                /* Do nothing. */
              }}
            >
              <span>
                <SelectTextWrapper>{val}</SelectTextWrapper>
              </span>
              <span />
            </SelectItemWrapper>
          ))}
        </SelectDropdownWrapper>
      )}
    </>
  );
};

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { SelectItemWrapper, SelectTextWrapper } from '../Wrappers';
import { camelize } from '@w3ux/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectDropdown } from 'library/SelectDropdown';
import type { SelectProps } from './types';

export const Select = ({ inputKey, values, label }: SelectProps) => {
  // Whether select options are open.
  const [open, setOpen] = useState<boolean>(false);
  console.log(inputKey, '(select)');

  // Outside alerter ignore class.
  const ignoreClass = `ignore-outside-alerter-select_${camelize(String(label))}`;

  return (
    <>
      <h4>{label}</h4>
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
        <SelectDropdown
          open={open}
          onOutsideClick={() => setOpen(false)}
          outsideAlerterIgnore={[ignoreClass]}
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
        </SelectDropdown>
      )}
    </>
  );
};

// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { camelize } from '@w3ux/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectDropdown } from 'library/SelectDropdown';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectWrapper,
} from 'library/Inputs/Wrappers';
import type { SelectProps } from './types';
import { Icon } from './Icon';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons';

export const Select = ({
  values,
  icons,
  value,
  label,
  onMount,
  onRender,
  onChange,
  disabled,
}: SelectProps) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'Select';

  // Whether select options are open.
  const [open, setOpen] = useState<boolean>(false);

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }
  // Outside alerter ignore class.
  const ignoreClass = `ignore-outside-alerter-select_${camelize(String(label || ''))}`;

  // Get the currently selected value, or fall back to the first value.
  const currentValue = ![undefined, ''].includes(value) ? value : values[0];

  // Get index of the current value.
  const currentIndex = values.indexOf(currentValue);

  // Get the icon for the current value.
  const currentIcon = icons ? icons[currentIndex] : '';

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    if (onMount !== undefined) {
      onMount(currentValue);
    }
  }, []);

  return (
    <SelectWrapper>
      {label && <h4>{label}</h4>}
      <SelectItemWrapper
        className={`standalone input${open ? ` open` : ``} ${ignoreClass}${disabled ? ` disabled` : ``}`}
        onClick={() => {
          if (!disabled) {
            setOpen(!open);
          }
        }}
      >
        <span>
          {currentIcon && <Icon icon={currentIcon} />}
          <SelectTextWrapper>{currentValue || `No Values`}</SelectTextWrapper>
        </span>
        <span>
          <FontAwesomeIcon
            icon={disabled ? faCheck : faChevronDown}
            transform="shrink-4"
          />
        </span>
      </SelectItemWrapper>

      {open && (
        <SelectDropdown
          open={open}
          onOutsideClick={() => setOpen(false)}
          outsideAlerterIgnore={[ignoreClass]}
        >
          {values.map((val) => {
            // Get index of the current value.
            const valIndex = values.indexOf(val);

            // Get the icon for the current value.
            const valIcon = icons ? icons[valIndex] : '';

            return (
              <SelectItemWrapper
                key={`select_${label}_${camelize(val)}`}
                className={`option`}
                onClick={() => {
                  if (onChange !== undefined) {
                    onChange(val);
                  }
                  setOpen(false);
                }}
              >
                <span>
                  {valIcon && <Icon icon={valIcon} />}
                  <SelectTextWrapper>{val}</SelectTextWrapper>
                </span>
                <span />
              </SelectItemWrapper>
            );
          })}
        </SelectDropdown>
      )}
    </SelectWrapper>
  );
};

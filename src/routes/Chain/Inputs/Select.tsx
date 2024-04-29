// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { SelectItemWrapper, SelectTextWrapper } from '../Wrappers';
import { camelize } from '@w3ux/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectDropdown } from 'library/SelectDropdown';
import type { SelectProps } from './types';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';

export const Select = ({
  inputKey,
  namespace,
  inputKeysRef,
  values,
  value,
  label,
}: SelectProps) => {
  const activeTabId = useActiveTabId();
  const { setInputArgAtKey } = useChainUi();

  // The input arg type of this component.
  const INPUT_TYPE = 'Select';

  // Whether select options are open.
  const [open, setOpen] = useState<boolean>(false);

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = INPUT_TYPE;
  }

  // Outside alerter ignore class.
  const ignoreClass = `ignore-outside-alerter-select_${camelize(String(label))}`;

  // Get the currently selected value, or fall back to the first value.
  const currentValue = value !== undefined ? value : values[0];

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: INPUT_TYPE,
      value: currentValue,
    });
  }, []);

  return (
    <>
      <h4>{label}</h4>
      <SelectItemWrapper
        className={`standalone input${open ? ` open` : ``} ${ignoreClass}`}
        onClick={() => setOpen(!open)}
      >
        <span>
          <SelectTextWrapper>{currentValue || `No Values`}</SelectTextWrapper>
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
                setInputArgAtKey(activeTabId, namespace, inputKey, {
                  input: INPUT_TYPE,
                  value: val,
                });
                setOpen(false);
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

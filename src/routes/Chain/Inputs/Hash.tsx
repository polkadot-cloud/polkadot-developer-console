// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { TextInputWrapper } from '../Wrappers';
import type { HashProps } from './types';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';

export const Hash = ({
  inputKey,
  namespace,
  inputKeysRef,
  defaultValue,
}: HashProps) => {
  const activeTabId = useActiveTabId();
  const { setInputArgAtKey } = useChainUi();

  // The input arg type of this component.
  const INPUT_TYPE = 'Hash';

  const [value, setValue] = useState<string | number>(defaultValue || '');

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = INPUT_TYPE;
  }

  // Handle textbox value change.
  const handleTextboxChange = (val: string) => {
    setValue(val);
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: INPUT_TYPE,
      value: val,
    });
  };

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: INPUT_TYPE,
      value,
    });
  }, []);

  return (
    <TextInputWrapper className="input">
      <input
        type="text"
        value={value || ''}
        placeholder="0x prefixed hash..."
        onChange={(ev) => handleTextboxChange(ev.currentTarget.value)}
      />
    </TextInputWrapper>
  );
};

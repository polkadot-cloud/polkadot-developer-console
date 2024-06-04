// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import type { HashProps } from './types';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';
import { TextInputWrapper } from 'library/Inputs/Wrappers';

export const Hash = ({
  inputKey,
  namespace,
  inputKeysRef,
  defaultValue,
}: HashProps) => {
  const { tabId } = useActiveTab();
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
    setInputArgAtKey(tabId, namespace, inputKey, val);
  };

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(tabId, namespace, inputKey, value);
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

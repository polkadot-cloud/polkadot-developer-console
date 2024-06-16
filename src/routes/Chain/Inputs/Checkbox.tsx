// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useEffect } from 'react';
import type { CheckboxProps } from './types';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';

export const Checkbox = ({
  inputKey,
  namespace,
  inputKeysRef,
  label,
  checked,
}: CheckboxProps) => {
  const { tabId } = useActiveTab();
  const { setInputArgAtKey } = useChainUi();

  // The input arg type of this component.
  const INPUT_TYPE = 'Checkbox';

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = INPUT_TYPE;
  }

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(tabId, namespace, inputKey, checked);
  }, []);

  return (
    <>
      {!!label && <h4>{label}</h4>}
      <Switch
        scale={0.85}
        active={checked}
        disabled={false}
        onSwitch={() => setInputArgAtKey(tabId, namespace, inputKey, !checked)}
      />
    </>
  );
};

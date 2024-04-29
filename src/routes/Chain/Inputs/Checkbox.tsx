// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useEffect, useState } from 'react';
import type { CheckboxProps } from './types';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';

export const Checkbox = ({
  inputKey,
  namespace,
  inputKeysRef,
  label,
  defaultValue,
}: CheckboxProps) => {
  const activeTabId = useActiveTabId();
  const { setInputArgAtKey } = useChainUi();

  // The input arg type of this component.
  const INPUT_TYPE = 'Checkbox';

  const [checked, setChecked] = useState<boolean>(defaultValue);

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = INPUT_TYPE;
  }

  // Update input arg value to the default value on initial render.
  useEffect(() => {
    setInputArgAtKey(activeTabId, namespace, inputKey, {
      input: INPUT_TYPE,
      value: checked,
    });
  }, []);

  return (
    <>
      <h4>{label}</h4>
      <Switch
        scale={0.85}
        active={checked}
        disabled={false}
        onSwitch={() => {
          setInputArgAtKey(activeTabId, namespace, inputKey, {
            input: INPUT_TYPE,
            value: !checked,
          });
          setChecked(!checked);
        }}
      />
    </>
  );
};

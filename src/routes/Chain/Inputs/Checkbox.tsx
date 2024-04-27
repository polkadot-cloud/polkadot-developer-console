// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useState } from 'react';
import type { CheckboxProps } from './types';

export const Checkbox = ({
  inputKey,
  inputKeysRef,
  label,
  defaultValue,
}: CheckboxProps) => {
  const [checked, setChecked] = useState<boolean>(defaultValue);

  // Accumulate input key.
  if (inputKeysRef.current) {
    inputKeysRef.current[inputKey] = 'Checkbox';
  }

  return (
    <>
      <h4>{label}</h4>
      <Switch
        scale={0.85}
        active={checked}
        disabled={false}
        onSwitch={() => setChecked(!checked)}
      />
    </>
  );
};

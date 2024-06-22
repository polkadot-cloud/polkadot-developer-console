// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useEffect } from 'react';
import type { CheckboxProps } from './types';

export const Checkbox = ({
  label,
  checked,
  onMount,
  onRender,
  onChange,
}: CheckboxProps) => {
  // The input arg type of this component.
  const INPUT_TYPE = 'Boolean';

  // Run `onRender` function.
  if (onRender !== undefined) {
    onRender(INPUT_TYPE);
  }

  // Handle checkbox change
  const handleCheckboxChange = (val: boolean) => {
    if (onChange !== undefined) {
      onChange(val);
    }
  };

  // Call on mount logic in initial render if provided.
  useEffect(() => {
    if (onMount !== undefined) {
      onMount(checked);
    }
  }, []);

  return (
    <>
      {!!label && <h4>{label}</h4>}
      <Switch
        scale={0.85}
        active={checked}
        disabled={false}
        onSwitch={() => handleCheckboxChange(!checked)}
      />
    </>
  );
};

// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useState } from 'react';

export const Checkbox = ({
  label,
  defaultValue,
}: {
  label: string | number;
  defaultValue: boolean;
}) => {
  const [checked, setChecked] = useState<boolean>(defaultValue);

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

// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface TextInputProps {
  name: string;
  value: string;
  placeholder: string;
  label?: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

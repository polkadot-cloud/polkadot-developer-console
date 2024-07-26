// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export interface TextInputProps {
  name: string;
  value: string;
  placeholder: string;
  label?: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

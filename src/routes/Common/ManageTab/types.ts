// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface InputProps {
  label: string;
  placeholder: string;
  initialValue: string;
  onSubmit: (value: string) => void;
}

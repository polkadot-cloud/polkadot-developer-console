// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export interface InputMetaContextInterface {
  getInputMetaValue: (tabId: number, inputId: string) => string | undefined;
  setInputMetaValue: (tabId: number, inputId: string, value: string) => void;
  removeInputMetaValue: (tabId: number, inputId: string) => void;
  destroyInputMeta: (tabId: number) => void;
}

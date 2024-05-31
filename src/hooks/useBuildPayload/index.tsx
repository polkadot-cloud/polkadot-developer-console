// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { UseBuildPayloadProps } from './types';

export const useBuildPayload = ({
  api,
  instanceId,
  nonce: nonceRaw,
  setPayload,
}: UseBuildPayloadProps) => {
  // Build and set payload of the transaction and store it in TxMeta's txPayloads state.
  const buildPayload = async (tx: AnyJson, from: string, uid: number) => {
    if (api && tx) {
      const lastHeader = await api.rpc.chain.getHeader();
      const blockNumber = api.registry.createType(
        'BlockNumber',
        lastHeader.number.toNumber()
      );
      const method = api.createType('Call', tx);
      const era = api.registry.createType('ExtrinsicEra', {
        current: lastHeader.number.toNumber(),
        period: 64,
      });

      const nonce = api.registry.createType('Compact<Index>', nonceRaw);

      const payload = {
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
        address: from,
        blockHash: lastHeader.hash.toHex(),
        blockNumber: blockNumber.toHex(),
        era: era.toHex(),
        genesisHash: api.genesisHash.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        signedExtensions: api.registry.signedExtensions,
        tip: api.registry.createType('Compact<Balance>', 0).toHex(),
        version: tx.version,
      };

      const raw = api.registry.createType('ExtrinsicPayload', payload, {
        version: payload.version,
      });

      setPayload(instanceId, raw, uid);
    }
  };

  return {
    buildPayload,
  };
};

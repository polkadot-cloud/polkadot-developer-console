// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { ParaIdOptionsWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { NextFreeParaId } from 'model/NextFreeParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import BigNumber from 'bignumber.js';
import { faCircle } from '@fortawesome/sharp-regular-svg-icons';
import { Textbox } from 'library/Inputs/Textbox';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { AnyJson } from '@w3ux/utils/types';
import { SubmitTx } from 'library/SubmitTx';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useReserveParaId } from 'contexts/ParaSetup/ReserveParaId';

export const ReserveParaId = () => {
  const { ownerId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { chainSpec, chain, instanceId, api } = useParachain();
  const { getNextParaId, nextParaIdChainExists, addNextParaIdChain } =
    useReserveParaId();

  const chainId = chain.id;
  const { ss58, units, unit } = chain;
  const nextParaId = getNextParaId(chainId);
  const { transactionVersion } = chainSpec.version;
  const { existentialDeposit } = chainSpec.consts;
  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Store the selected account for the Para ID.
  // TODO: Move this to `ParaSetup` context, key by tab.
  const initialAccount = accounts?.[0]?.address || '';
  const [selectedAccount, setSelectedAccount] =
    useState<string>(initialAccount);

  // Store the selected option for the Para ID.
  // TODO: Move this to `ParaSetup` context, key by tab.
  const [selectedOption, setSelectedOption] = useState<'new' | 'existing'>(
    'new'
  );

  // Store an existing para id.
  // TODO: Move this to `ParaSetup` context, key by tab.
  const [existingParaId, setExistingParaId] = useState<string>();

  // Store whether the existing para id is valid for the selected account.
  // TODO: Move this to `ParaSetup` context, key by tab.
  const [existingParaIdValid, setExistingParaIdValid] =
    useState<boolean>(false);

  // Query the chain to see if an existing para id exists with the given address.
  const queryExistingParaId = async () => {
    if (!existingParaId || !selectedAccount) {
      return;
    }
    // Get para id from chain.
    const result = await api.query.registrar.paras(existingParaId);
    const manager = (result.toHuman() as AnyJson)?.manager;

    if (manager === selectedAccount) {
      setExistingParaIdValid(true);
    }
  };

  // Format transaction for reserving next para id to submit, or return `null` if invalid.
  const getTx = () => {
    let tx = null;

    if (!api || selectedOption !== 'new' || !selectedAccount || !nextParaId) {
      return tx;
    }

    try {
      // Construct transaction.
      tx = api.tx.registrar.reserve();
      return tx;
    } catch (e) {
      return null;
    }
  };

  // Prepare extrinsic for reserving the next para id.
  const submitExtrinsic = useSubmitExtrinsic({
    instanceId,
    api,
    chainId,
    ss58Prefix: ss58,
    tx: getTx(),
    from: selectedAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      /* TODO: Store reserved id in parachain context state.. */
    },
  });

  // Determine whether tx submission ui can be displayed.
  const reserveNextIdValid =
    selectedOption === 'new' && !!selectedAccount && !!nextParaId;

  // Get the next free Para ID from the registrar.
  useEffect(() => {
    // Check if this next para id subscription is not already initialised.
    if (!nextParaIdChainExists(chainId)) {
      addNextParaIdChain(chainId);

      SubscriptionsController.set(
        instanceId,
        'nextFreeParaId',
        new NextFreeParaId(ownerId, instanceId, chainId)
      );
    }
  }, []);

  // Query the chain for an existing para id when the existing para id changes.
  useEffectIgnoreInitial(() => {
    if (selectedOption === 'existing') {
      queryExistingParaId();
    }
  }, [existingParaId, selectedAccount]);

  // When the selected option and para id is valid, update context state for this tab.
  useEffectIgnoreInitial(() => {
    if (selectedOption === 'existing' && existingParaIdValid) {
      // TODO: Set para id for this tab.
    }

    // TODO: replace `nextParaId` with the actual reserved para id here.
    if (selectedOption === 'new' && !!nextParaId) {
      // TODO: set para id for this tab.
    }
  }, [selectedOption, existingParaIdValid, nextParaId]);

  return (
    <FormWrapper>
      <h3>Reserve a Para ID or select an existing one from your accounts.</h3>
      <section>
        <AccountId32
          accounts={accounts}
          defaultValue={selectedAccount}
          onChange={(val) => setSelectedAccount(val)}
        />
        <ParaIdOptionsWrapper>
          <section>
            <div
              className={`inner ${selectedOption === 'new' ? ' selected' : ''}`}
            >
              <h3>Reserve Next Para ID</h3>
              <h1>
                {nextParaId ? new BigNumber(nextParaId).toString() : '...'}
              </h1>
              <button className="foot" onClick={() => setSelectedOption('new')}>
                <span>
                  <h4>{selectedOption === 'new' ? ' Selected' : 'Select'}</h4>
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={selectedOption === 'new' ? faCheckCircle : faCircle}
                    transform="grow-2"
                  />
                </span>
              </button>
            </div>
          </section>
          <section>
            <div
              className={`inner ${selectedOption === 'existing' ? ' selected' : ''}`}
            >
              <h3>Find Existing Para ID</h3>
              <Textbox
                /* TODO: add onFocus and setSelectedOption('existing') */
                defaultValue={existingParaId || ''}
                onChange={(val) => setExistingParaId(val)}
                placeholder="Para ID"
                numeric
              />
              <button
                className="foot"
                onClick={() => setSelectedOption('existing')}
              >
                <span>
                  <h4>
                    {selectedOption === 'existing' ? ' Selected' : 'Select'}
                  </h4>
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={
                      selectedOption === 'existing' ? faCheckCircle : faCircle
                    }
                    transform="grow-2"
                  />
                </span>
              </button>
            </div>
          </section>
        </ParaIdOptionsWrapper>
        {reserveNextIdValid && (
          <SubmitTx
            {...submitExtrinsic}
            valid={reserveNextIdValid}
            instanceId={instanceId}
            chainId={chainId}
            ss58Prefix={ss58}
            units={units}
            unit={unit}
            existentialDeposit={existentialDeposit}
            transactionVersion={String(transactionVersion)}
          />
        )}
      </section>
    </FormWrapper>
  );
};

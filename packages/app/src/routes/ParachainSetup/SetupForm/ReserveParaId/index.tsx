// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { SetupNote } from '../Wrappers';
import { iconCheckCircle, iconCircle } from '@polkadot-cloud/icons/regular';
import { useEffect } from 'react';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { NextFreeParaId } from 'model/NextFreeParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import BigNumber from 'bignumber.js';
import { Textbox } from 'library/Inputs/Textbox';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { SubmitTx } from 'library/SubmitTx';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useReserveParaId } from 'contexts/ParaSetup/ReserveParaId';
import type { ReservedParaId } from 'contexts/ParaSetup/ReserveParaId/types';
import { ParaIdOptionsWrapper } from './Wrappers';
import { CloudIcon } from '@polkadot-cloud/icons';

export const ReserveParaId = () => {
  const {
    getNextParaId,
    nextParaIdChainExists,
    addNextParaIdChain,
    getSelectedAccount,
    setSelectedAccount,
    getSelectedOption,
    setSelectedOption,
    getExistingParaIdInput,
    setExistingParaIdInput,
    getExistingReservedParaId,
    setExistingReservedParaId,
    getReservedNextParaId,
    setReservedNextParaId,
    validateParaId,
  } = useReserveParaId();
  const { getAccounts } = useImportedAccounts();
  const { ownerId, tabId, metaKey } = useActiveTab();
  const { chainSpec, chain, instanceId, api } = useParachain();

  const chainId = chain.id;
  const { ss58, units, unit } = chain;
  const nextParaId = getNextParaId(chainId);
  const { transactionVersion } = chainSpec.version;
  const { existentialDeposit } = chainSpec.consts;
  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Get the selected account for the Para ID.
  const selectedAccount =
    getSelectedAccount(tabId) || accounts?.[0]?.address || '';

  // Get the selected option for the Para ID.
  const selectedOption = getSelectedOption(tabId);

  // Get the existing para id input.
  const existingParaId = getExistingParaIdInput(tabId);

  // Get a reserved next para id for the account, if any.
  const reservedNextParaId = getReservedNextParaId(tabId, selectedAccount);

  // Query the chain to see if an existing para id exists with the given address.
  const queryExistingParaId = async () => {
    if (!existingParaId || !selectedAccount) {
      return;
    }

    let valid = false;

    // Get para id from chain.
    const result = await api.query.registrar.paras(existingParaId);
    const json = result?.toHuman() as unknown as ReservedParaId | null;

    // If a record exists, continue to check if this paraId has not been onboarded.
    if (json) {
      const result2 = await api.query.paras.paraLifecycles(existingParaId);
      if (result2.toHuman() === null) {
        valid = true;
        json.paraId = existingParaId;
      }
    }
    setExistingReservedParaId(tabId, valid ? json : null);
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
    api,
    instanceId,
    chainId,
    ss58Prefix: ss58,
    unit,
    tx: getTx(),
    from: selectedAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      if (nextParaId) {
        // Store reserved id in parachain context state. NOTE: this could be improved by using the
        // actual arguments that were sent to the tx.
        setReservedNextParaId(tabId, selectedAccount, nextParaId);
      }
    },
  });

  // Determine whether tx submission ui can be displayed.
  const reserveNextIdValid =
    selectedOption === 'new' && !!selectedAccount && !!nextParaId;

  // Determine if existing para id form is valid.
  const reservedExistingParaId = getExistingReservedParaId(tabId);

  // Determine existing para id feedback.
  const existingFeedback: string =
    reservedExistingParaId === null
      ? `Para ID ${existingParaId} is not valid.`
      : reservedExistingParaId !== undefined
        ? reservedExistingParaId.manager === selectedAccount
          ? `Found Para ID ${reservedExistingParaId.paraId}. Ready to configure node.`
          : `Para ID found, but has a different owner.`
        : 'Ready to fetch Para ID.';

  // Determine new para id feedback.
  const newFeedback: string = reservedNextParaId
    ? 'Para ID reserved. Ready to configure node.'
    : 'Ready to Reserve Para ID.';

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
    queryExistingParaId();
  }, [existingParaId, selectedAccount]);

  return (
    <FormWrapper>
      <h3>Reserve a Para ID or select an existing one from your accounts</h3>
      <section>
        <AccountId32
          inputId={`${metaKey}_managerAddress`}
          defaultAddress={selectedAccount}
          accounts={accounts}
          onChange={(val) => setSelectedAccount(tabId, val)}
        />
        <ParaIdOptionsWrapper>
          <section>
            <div
              className={`inner ${selectedOption === 'new' ? ' selected' : ''}`}
            >
              <h3>Reserve Next Para ID</h3>
              <button onClick={() => setSelectedOption(tabId, 'new')}>
                <h1>
                  {nextParaId ? new BigNumber(nextParaId).toString() : '...'}
                </h1>
              </button>
              <button
                className="foot"
                onClick={() => setSelectedOption(tabId, 'new')}
              >
                <span>
                  <h4>{selectedOption === 'new' ? ' Selected' : 'Select'}</h4>
                </span>
                <span>
                  {selectedOption === 'new' ? (
                    <CloudIcon icon={iconCheckCircle} transform="grow-2" />
                  ) : (
                    <CloudIcon icon={iconCircle} transform="grow-2" />
                  )}
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
                value={existingParaId || ''}
                onFocus={() => setSelectedOption(tabId, 'existing')}
                onChange={(val) => setExistingParaIdInput(tabId, val)}
                placeholder="Para ID"
                shrinkPlaceholder={true}
                numeric
              />
              <button
                className="foot"
                onClick={() => setSelectedOption(tabId, 'existing')}
              >
                <span>
                  <h4>
                    {selectedOption === 'existing' ? ' Selected' : 'Select'}
                  </h4>
                </span>
                <span>
                  {selectedOption === 'existing' ? (
                    <CloudIcon icon={iconCheckCircle} transform="grow-2" />
                  ) : (
                    <CloudIcon icon={iconCircle} transform="grow-2" />
                  )}
                </span>
              </button>
            </div>
          </section>
        </ParaIdOptionsWrapper>

        <SetupNote>
          {validateParaId(tabId, selectedAccount) ? (
            <CloudIcon icon={iconCheckCircle} transform="grow-1" />
          ) : null}
          {selectedOption === 'existing' ? existingFeedback : newFeedback}
        </SetupNote>

        {/* Show tx submission if a next para id has not been reserved for the selected account. */}
        {!reservedNextParaId && reserveNextIdValid && (
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

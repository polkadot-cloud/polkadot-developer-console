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
import { useParaSetup } from 'contexts/ParaSetup';
import { NextFreeParaId } from 'model/NextFreeParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import BigNumber from 'bignumber.js';
import { faCircle } from '@fortawesome/sharp-regular-svg-icons';
import { Textbox } from 'library/Inputs/Textbox';
import { useEffectIgnoreInitial } from '@w3ux/hooks';

export const ReserveParaId = () => {
  const { ownerId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { chainSpec, chain, instanceId } = useParachain();
  const { getNextParaId, nextParaIdChainExists, addNextParaIdchain } =
    useParaSetup();

  const chainId = chain.id;
  const nextParaId = getNextParaId(chainId);
  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Store the selected account for the Para ID.
  const initialAccount = accounts?.[0]?.address;
  const [selectedAccount, setSelectedAccount] =
    useState<string>(initialAccount);

  // Store the selected option for the Para ID.
  const [selectedOption, setSelectedOption] = useState<'new' | 'existing'>(
    'new'
  );

  // Store an existing para id.
  const [existingParaId, setExistingParaId] = useState<string>();

  // Query the chain to see if an existing para id exists with the given address.
  const queryExistingParaId = async () => {
    if (!existingParaId || !selectedAccount) {
      return;
    }
    // TODO: implement query using api.
  };

  // Get the next free Para ID from the registrar.
  useEffect(() => {
    // Check if this next para id subscription is not already initialised.
    if (!nextParaIdChainExists(chainId)) {
      addNextParaIdchain(chainId);

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
  }, [existingParaId]);

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
              <h3>Reserve New Para ID</h3>
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
      </section>
    </FormWrapper>
  );
};

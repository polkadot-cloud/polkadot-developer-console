// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper } from 'routes/Home/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/pro-solid-svg-icons';
import { useReserveParaId } from 'contexts/ParaSetup/ReserveParaId';
import { useActiveTab } from 'contexts/ActiveTab';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useParachain } from 'routes/ParachainSetup/Provider';
import { Label } from 'library/Inputs/Label';
import { Prompt } from '../Prompt';
import { Hash } from 'library/Inputs/Hash';
import { useRegisterParathread } from 'contexts/ParaSetup/RegisterParathread';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';

export const RegisterParathread = () => {
  const { tabId, metaKey } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { chainSpec, api, instanceId, chain } = useParachain();
  const { getSelectedAccount, validateParaId } = useReserveParaId();
  const { getRuntimeValue, setRuntimeValue, getGenesisState, setGenesisState } =
    useRegisterParathread();

  const chainId = chain.id;
  const { ss58, units, unit } = chain;
  const { transactionVersion } = chainSpec.version;
  const { existentialDeposit } = chainSpec.consts;

  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Get the selected account for the Para ID.
  const selectedAccount = getSelectedAccount(tabId) || '';

  // Get whether a valid para id has been entered.
  const isValidParaId = validateParaId(tabId, selectedAccount);

  // Get any entered runtime value.
  const runtimeValue = getRuntimeValue(tabId) || '';
  const genesisState = getGenesisState(tabId) || '';

  // Get the selected account if a valid para id has been entered, otherwise return an empty array.
  const registrantInputValues = !isValidParaId
    ? []
    : accounts.filter((account) => account.address === selectedAccount);

  // Whether form is valid for tx submission.
  const valid = !(!selectedAccount || !runtimeValue || !genesisState);

  // Format transaction for registering parathread to submit, or return `null` if invalid.
  const getTx = () => {
    let tx = null;

    if (!api || !valid) {
      return tx;
    }

    try {
      // Construct transaction.
      // TODO: Get the submitted para ID (new or existing).
      const paraId = 0;
      tx = api.tx.registrar.regsiter(paraId, genesisState, runtimeValue);
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
      // TODO: Handle successful submission (parathread registered state).
    },
  });

  return (
    <FormWrapper>
      <Prompt>
        <section>
          <h4>
            Configure your node using your reserved Para ID, and export your
            updated WebAssembly runtime and genesis state. Details on how to do
            this can be found in the Substrate.io article:
          </h4>
          <h4>
            <a
              href="https://docs.substrate.io/tutorials/build-a-parachain/acquire-a-testnet-slot/#export-required-files"
              rel="noreferrer"
              target="_blank"
            >
              Acquire a testnet slot{' '}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
            .
          </h4>
        </section>
      </Prompt>

      <h3>Register your Parathread</h3>

      <section>
        <Label value="Registrant" />
        <AccountId32
          inputId={`${metaKey}_registerParathreadRegistrant`}
          defaultAddress={isValidParaId ? selectedAccount : ''}
          accounts={registrantInputValues}
          readOnly={true}
          disabled={true}
          disabledText="Para ID Registrant Not Set"
        />
      </section>

      <section>
        <Label value="WebAssembly Runtime" />
        <Hash
          onChange={(val) => {
            setRuntimeValue(tabId, val);
          }}
          value={runtimeValue}
        />
      </section>

      <section>
        <Label value="Genesis State" />
        <Hash
          onChange={(val) => {
            setGenesisState(tabId, val);
          }}
          value={genesisState}
        />
      </section>

      <section>
        {/* TODO: Esimtated deposit for registering parathread */}
      </section>

      <section>
        <SubmitTx
          {...submitExtrinsic}
          valid={valid}
          instanceId={instanceId}
          chainId={chainId}
          ss58Prefix={ss58}
          units={units}
          unit={unit}
          existentialDeposit={existentialDeposit}
          transactionVersion={String(transactionVersion)}
        />
      </section>
    </FormWrapper>
  );
};

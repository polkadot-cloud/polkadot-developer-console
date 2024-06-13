// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PalletList } from '../PalletList';
import { CallList } from './CallList';
import { PalletScraper } from 'model/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { Header } from './Header';
import { useActiveTab } from 'contexts/ActiveTab';
import { useMemo } from 'react';
import type { PalletData } from '../ChainState/types';
import { Inputs } from 'model/Scraper/Inputs';
import { InputForm } from '../InputForm';
import { SelectFormWrapper, SenderWrapper } from 'library/Inputs/Wrappers';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { useChain } from '../Provider';
import { SubmitTx } from 'library/SubmitTx';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { InputFormProvider, useInputForm } from '../InputForm/provider';
import { camelize } from '@w3ux/utils';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { Label } from 'library/Inputs/Label';
import { useChainState } from 'contexts/ChainState';

export const ExtrinsicsInner = () => {
  const { handleSubmit } = useInputForm();
  const { tabId, metaKey } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { chainSpec, instanceId, chain, api } = useChain();
  const { getChainUi, setChainUiNamespace } = useChainUi();
  const { getFromAddress, setFromAddress } = useChainState();

  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Get the sender address.
  const fromAddress = getFromAddress(tabId) || '';

  const chainUiSection = 'calls';
  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = chainSpec.metadata;
  const {
    ss58Prefix,
    consts: { existentialDeposit },
  } = chainSpec;
  const { unit, units, id: chainId } = chain;
  const { transactionVersion } = chainSpec.version;

  // Fetch storage data when metadata or the selected pallet changes.
  const callData = useMemo((): PalletData => {
    const scraper = new PalletScraper(Metadata, {
      maxDepth: 7,
    });
    const pallets = scraper.getPalletList(['calls']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    // Get call items for the active pallet.
    let items = activePallet ? scraper.getCalls(activePallet) : [];

    // Sort the call items by name.
    items = items.sort(({ name: nameA }, { name: nameB }) =>
      nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    );

    const result: PalletData = {
      pallets,
      activePallet,
      items,
    };

    return result;
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, items } = callData;

  // If no call is selected, select the first one from the list or fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Get the whole call item record from metadata for input formatting.
  const activeListItem = useMemo(() => {
    if (!activePallet || !activeItem) {
      return null;
    }
    // NOTE: Currently limiting scraper to 7 recursive levels to avoid app freezing.
    const scraper = new PalletScraper(Metadata, { maxDepth: 7 });
    return scraper.getCallItem(activePallet, activeItem);
  }, [items, activeItem, activePallet]);

  // Get input markup for the active call item.
  const inputForm =
    activePallet !== null && activeItem !== null && !!activeListItem
      ? new Inputs(activeListItem).format()
      : null;

  // Transaction is submittable once from address has been defined.
  const submittable = fromAddress !== null;

  // Format the transaction to submit, or return `null` if invalid.
  const getTx = () => {
    let tx = null;

    if (!api || !submittable || !activePallet || !activeItem) {
      return tx;
    }

    // Get transaction args from input form.
    let resultInput = handleSubmit();

    // Wrap resulting args into an array if it is not already.
    if (!Array.isArray(resultInput) && resultInput !== undefined) {
      resultInput = [resultInput];
    }

    try {
      // Construct transaction.
      tx = api.tx[camelize(activePallet)][camelize(activeItem)](
        ...Object.values(resultInput || [undefined])
      );
      return tx;
    } catch (e) {
      return null;
    }
  };

  // Prepare the extrinsic.
  const submitExtrinsic = useSubmitExtrinsic({
    instanceId,
    api,
    chainId,
    ss58Prefix,
    tx: getTx(),
    from: fromAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      /* Do nothing. */
    },
  });

  return (
    <FlexWrapper>
      <Header />
      <SelectFormWrapper className="withHeader">
        <PalletList
          activePallet={activePallet}
          pallets={pallets}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiNamespace(tabId, chainUiSection, 'pallet', value);
          }}
        />
        <CallList items={items} activeItem={activeItem} />
      </SelectFormWrapper>
      <InputForm
        inputForm={inputForm}
        activePallet={activePallet}
        activeItem={activeItem}
      />

      <SenderWrapper>
        <Label value="Sender" marginTop />
        <AccountId32
          uid={`${metaKey}_sendAddress`}
          defaultAddress={fromAddress || undefined}
          accounts={accounts}
          onChange={(val) => setFromAddress(tabId, val)}
        />
      </SenderWrapper>

      <SubmitTx
        {...submitExtrinsic}
        valid={submittable}
        instanceId={instanceId}
        chainId={chainId}
        ss58Prefix={ss58Prefix}
        units={units}
        unit={unit}
        existentialDeposit={existentialDeposit}
        transactionVersion={String(transactionVersion)}
      />
    </FlexWrapper>
  );
};

export const Extrinsics = () => (
  <InputFormProvider namespace="call">
    <ExtrinsicsInner />
  </InputFormProvider>
);

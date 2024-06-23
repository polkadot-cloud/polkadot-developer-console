// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PalletList } from '../PalletList';
import { CallList } from './CallList';
import { PalletScraper } from 'model/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { Header } from './Header';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffect, useMemo } from 'react';
import type { PalletData } from '../ChainState/types';
import { InputForm } from '../InputForm';
import { SelectFormWrapper, SenderWrapper } from 'library/Inputs/Wrappers';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { useChain } from '../Provider';
import { InputFormProvider } from '../InputForm/provider';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { Label } from 'library/Inputs/Label';
import { useChainState } from 'contexts/ChainState';
import { Submit } from './Submit';
import type { InputNamespace } from 'contexts/ChainUi/types';

export const Extrinsics = () => {
  const { chainSpec } = useChain();
  const { tabId, metaKey } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { getFromAddress, setFromAddress } = useChainState();
  const { getChainUi, setChainUiNamespace, resetInputArgs } = useChainUi();

  const chainUiSection = 'calls';
  const inputNamespace: InputNamespace = 'call';
  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = chainSpec.metadata;

  // Get accounts for sender address input.
  const accounts = chainSpec
    ? getAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
    : [];

  // Get the sender address.
  const fromAddress = getFromAddress(tabId) || '';

  // Fetch storage data when metadata or the selected pallet changes.
  const callData = useMemo((): PalletData => {
    const scraper = new PalletScraper(Metadata, {
      maxDepth: 7,
      labelsOnly: true,
    });
    const pallets = scraper.getPalletList([chainUiSection]);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    // Get call items for the active pallet.
    let items = activePallet ? scraper.getCalls(activePallet) : [];

    // Sort the call items by name.
    items = items.sort(({ name: nameA }, { name: nameB }) =>
      nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    );

    // Return formatted call and pallet data.
    return {
      pallets,
      activePallet,
      items,
    };
  }, [chainUi.pallet, Metadata?.metadata]);

  const { pallets, activePallet, items } = callData;

  // If no call is selected, select the first one from the list or fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Get the whole call item record from metadata for input formatting.
  const scraperResult = useMemo(() => {
    if (!activePallet || !activeItem) {
      return null;
    }

    const scraper = new PalletScraper(Metadata, {
      maxDepth: '*',
      labelsOnly: false,
    });
    const scrapedItem = scraper.getCallItem(activePallet, activeItem);

    return { scrapedItem, scraper };
  }, [items, activeItem, activePallet]);

  // Get scrape result.
  const scrapedItem = scraperResult?.scrapedItem || null;
  const itemScraper = scraperResult?.scraper || null;

  // Manage `activeItem` changes.
  useEffect(() => {
    // On initial render, set the selected item to the first list item, if any.
    if (activeItem) {
      setChainUiNamespace(tabId, chainUiSection, 'selected', activeItem);
    }
  }, [activeItem]);

  return (
    <InputFormProvider namespace={inputNamespace} scraper={itemScraper}>
      <FlexWrapper>
        <Header />
        <SelectFormWrapper className="withHeader">
          <PalletList
            activePallet={activePallet}
            pallets={pallets}
            chainUiSection={chainUiSection}
            onSelect={(value) => {
              // Update selected pallet in chain ui state.
              setChainUiNamespace(tabId, chainUiSection, 'pallet', value);

              // Reset input args when selected pallet changes.
              resetInputArgs(tabId, inputNamespace);
            }}
          />
          <CallList items={items} />
        </SelectFormWrapper>
        <InputForm
          argTypes={scrapedItem?.argTypes}
          activePallet={activePallet}
          activeItem={activeItem}
          scraper={itemScraper}
        />

        <SenderWrapper>
          <Label value="Sender" marginTop />
          <AccountId32
            inputId={`${metaKey}_sendAddress`}
            defaultAddress={fromAddress || undefined}
            accounts={accounts}
            onChange={(val) => setFromAddress(tabId, val)}
          />
        </SenderWrapper>
        <Submit activePallet={activePallet} activeItem={activeItem} />
      </FlexWrapper>
    </InputFormProvider>
  );
};

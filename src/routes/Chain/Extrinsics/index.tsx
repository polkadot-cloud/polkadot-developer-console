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

export const Extrinsics = () => {
  const { chainSpec } = useChain();
  const { tabId, metaKey } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
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
  const scraperResult = useMemo(() => {
    if (!activePallet || !activeItem) {
      return null;
    }
    // NOTE: Currently limiting scraper to 7 recursive levels to improve performance.
    const scraper = new PalletScraper(Metadata, { maxDepth: 7 });
    const result = scraper.getCallItem(activePallet, activeItem);

    return { scrapedItem: result, scraper };
  }, [items, activeItem, activePallet]);

  // Get scrape result.
  const scrapedItem = scraperResult?.scrapedItem || null;
  const itemScraper = scraperResult?.scraper || null;

  return (
    <InputFormProvider namespace="call" activeItem={activeItem}>
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
          argTypes={scrapedItem?.argTypes}
          activePallet={activePallet}
          activeItem={activeItem}
          scraper={itemScraper}
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
        <Submit activePallet={activePallet} activeItem={activeItem} />
      </FlexWrapper>
    </InputFormProvider>
  );
};

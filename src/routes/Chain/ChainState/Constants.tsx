// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { InputFormWrapper } from '../Wrappers';
import { useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useActiveTab } from 'contexts/ActiveTab';
import type { PalletData } from './types';
import { camelize } from '@w3ux/utils';
import { ChainStateController } from 'controllers/ChainState';
import { useChainState } from 'contexts/ChainState';
import { Results } from './Results';
import { SelectFormWrapper } from 'library/Inputs/Wrappers';
import { useChain } from '../Provider';

export const Constants = () => {
  const { tabId } = useActiveTab();
  const { setConstant } = useChainState();
  const { chainSpec, instanceId } = useChain();
  const { getChainUi, setChainUiNamespace } = useChainUi();

  const chainUiSection = 'constants';
  const chainUi = getChainUi(tabId, chainUiSection);
  const Metadata = chainSpec.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const scraperResult = useMemo(() => {
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getPalletList(['constants']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;
    const items = activePallet ? scraper.getConstants(activePallet) : [];

    const result: PalletData = {
      pallets,
      activePallet,
      items,
    };

    return { scrapedItem: result, scraper };
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  // Get scrape result.
  const scrapedItem = scraperResult?.scrapedItem || null;
  const listScraper = scraperResult?.scraper || null;

  const { pallets, activePallet, items } = scrapedItem;

  // If no storage item selected, select the first one from the list or fall back to null.
  const activeItem = chainUi.selected || items?.[0]?.name || null;

  // Handle retrieval of constant from scraped items.
  const handleSubmit = () => {
    const chainState = ChainStateController.instances[instanceId];

    if (activePallet && activeItem) {
      const pallet = camelize(activePallet);
      const constant = camelize(activeItem);

      const result = chainState.fetchConstant(pallet, constant);
      if (result !== null) {
        setConstant(result.key, result.value);
      }
    }
  };

  return (
    <>
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          activePallet={activePallet}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiNamespace(tabId, chainUiSection, 'pallet', value);
          }}
        />
        <ChainStateList
          scraper={listScraper}
          subject="Runtime Constant"
          items={items}
          activeItem={activeItem}
          chainUiSection={chainUiSection}
        />
      </SelectFormWrapper>
      <InputFormWrapper>
        <section className="footer">
          <ButtonText onClick={() => handleSubmit()}>
            Submit
            <FontAwesomeIcon
              icon={faCircleRight}
              transform="shrink-1"
              className="iconRight"
            />
          </ButtonText>
        </section>
      </InputFormWrapper>

      <Results storageType="constant" />
    </>
  );
};

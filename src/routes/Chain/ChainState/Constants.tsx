// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { InputFormWrapper, SelectFormWrapper } from '../Wrappers';
import { useApi } from 'contexts/Api';
import { useMemo } from 'react';
import { PalletList } from '../PalletList';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import { useChainUi } from 'contexts/ChainUi';
import { ChainStateList } from './ChainStateList';
import { ButtonSubmit } from 'library/Buttons/ButtonSubmit';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useActiveTabId } from 'contexts/RenderedTab';

export const Constants = () => {
  const { getChainSpec } = useApi();
  const activeTabId = useActiveTabId();
  const { getChainUi, setChainUiItem } = useChainUi();

  const chainUiSection = 'constants';
  const chainUi = getChainUi(activeTabId, chainUiSection);
  const Metadata = getChainSpec(activeTabId)?.metadata;

  // Fetch storage data when metadata or the selected pallet changes.
  const constantsData = useMemo(() => {
    if (!Metadata) {
      return {
        pallets: [],
        activePallet: null,
        constantItems: [],
        activeConstantItem: null,
      };
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(Metadata);
    const pallets = scraper.getList(['constants']);

    // If no pallet selected, get first one from scraper or fall back to null.
    const activePallet = chainUi.pallet || pallets?.[0].name || null;

    const constantItems = activePallet
      ? scraper.getConstants(activePallet)
      : [];

    // If no storage item selected, select the first one from the list or fall back to null.
    const activeConstantItem =
      chainUi.selected || constantItems?.[0]?.name || null;

    return {
      pallets,
      activePallet,
      constantItems,
      activeConstantItem,
    };
  }, [chainUi.pallet, chainUi.selected, Metadata?.metadata]);

  const { pallets, activePallet, constantItems, activeConstantItem } =
    constantsData;

  return (
    <>
      <SelectFormWrapper className="withHeader">
        <PalletList
          pallets={pallets}
          activePallet={activePallet}
          chainUiSection={chainUiSection}
          onSelect={(value) => {
            setChainUiItem(activeTabId, chainUiSection, 'pallet', value);
          }}
        />
        <ChainStateList
          subject="Runtime Constant"
          items={constantItems}
          activeItem={activeConstantItem}
          chainUiSection={chainUiSection}
        />
      </SelectFormWrapper>
      <InputFormWrapper>
        <section className="footer">
          <ButtonSubmit
            onClick={() => {
              /* Do nothing */
            }}
          >
            Submit
            <FontAwesomeIcon icon={faCircleRight} transform="shrink-1" />
          </ButtonSubmit>
        </section>
      </InputFormWrapper>
    </>
  );
};

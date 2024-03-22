// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SelectItemWrapper,
  SelectTextWrapper,
  SelectDropdownWrapper,
} from './Wrappers';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import type { PalletListItem } from 'model/Metadata/Scraper/types';
import { useApi } from 'contexts/Api';
import { xxhashAsHex } from '@polkadot/util-crypto';
import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@w3ux/utils/types';
import { u16 } from 'scale-ts';

export const PalletList = ({
  pallets,
  selected,
  onSelect,
}: {
  pallets: PalletListItem[];
  selected: string | null;
  onSelect: (value: string) => void;
}) => {
  const { getTabApi } = useApi();
  const api = getTabApi();

  // Pallet selection open.
  const [palletsOpen, setPalletsOpenState] = useState<boolean>(false);

  // Pallet versions (fetched separately from raw storage calls).
  const [palletVersions, setPalletVersions] = useState<Record<string, string>>(
    {}
  );

  // Setter for pallet menu open state.
  const setPalletsOpen = (value: boolean) => {
    setPalletsOpenState(value);
  };

  // Handle fetching of pallet versions.
  const fetchPalletVersions = async (apiInstance: ApiPromise) => {
    // Map through pallets and set up an array of calls to query the RPC with.
    const calls = pallets.map(({ name }) => {
      const storageKey =
        xxhashAsHex(name, 128) +
        xxhashAsHex(':__STORAGE_VERSION__:', 128).slice(2);
      return apiInstance.rpc.state.getStorage(storageKey);
    });

    const result = await Promise.all(calls);

    const newPalletVersions = Object.fromEntries(
      result.map((element: AnyJson, index: number) => {
        // Empty return types can be assumed to be version 0.
        const versionAsHex = element.toHex();
        return [
          pallets[index].name,
          versionAsHex == '0x' ? '0' : String(u16.dec(element.toString())),
        ];
      })
    );

    setPalletVersions(newPalletVersions);
  };

  // Fetch pallet version on fist render.
  //
  // TODO: only do this once when metadata changes and store in context state. Ensure that pallets
  // are fetched.
  const palletVersionsFetched = useRef<boolean>(false);
  useEffect(() => {
    if (api && pallets.length && !palletVersionsFetched.current) {
      palletVersionsFetched.current = true;
      fetchPalletVersions(api.api);
    }
  }, [!!api, pallets]);

  // Selection menu ref.
  const palletSelectRef = useRef<HTMLDivElement>(null);

  // Close pallet selection if clicked outside of its container.
  useOutsideAlerter(
    palletSelectRef,
    () => {
      setPalletsOpen(false);
    },
    ['ignore-outside-alerter-pallets']
  );

  return (
    <section>
      <div className="inner">
        <h5>Pallet</h5>
        <SelectItemWrapper
          className={`standalone${palletsOpen ? ` open` : ``} ignore-outside-alerter-pallets`}
          onClick={() => {
            setPalletsOpen(!palletsOpen);
          }}
        >
          <span>
            <SelectTextWrapper>{selected || 'No Pallets'}</SelectTextWrapper>
          </span>
          <span>
            {selected && palletVersions[selected] ? (
              <h5>v{palletVersions[selected]}</h5>
            ) : (
              ''
            )}

            <FontAwesomeIcon icon={faChevronDown} transform="shrink-4" />
          </span>
        </SelectItemWrapper>

        <SelectDropdownWrapper
          ref={palletSelectRef}
          className={`${palletsOpen ? ` open` : ``}`}
        >
          {pallets.map(({ index, name }) => (
            <SelectItemWrapper
              key={`pallet_${index}_${name}`}
              className={`option${selected === name ? ` selected` : ``}`}
              onClick={() => {
                setPalletsOpen(false);
                onSelect(name);
              }}
            >
              <span>
                <SelectTextWrapper>{name}</SelectTextWrapper>
              </span>
              <span>
                {palletVersions[name] ? <h5>v{palletVersions[name]}</h5> : ''}
              </span>
            </SelectItemWrapper>
          ))}
        </SelectDropdownWrapper>
      </div>
    </section>
  );
};

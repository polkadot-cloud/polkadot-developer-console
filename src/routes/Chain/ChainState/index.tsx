// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Constants } from './Constants';
import { Header } from './Header';
import { StorageItems } from './StorageItems';

export const ChainState = ({
  chainStateSection,
}: {
  chainStateSection?: string;
}) => {
  // TODO: Expand for raw storage and chain constants.
  let content: JSX.Element;
  switch (chainStateSection) {
    case 'constants':
      content = <Constants />;
      break;
    case 'storage':
    default:
      content = <StorageItems />;
      break;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
};

// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Results } from '../ChainState/Results';
import { Subheading } from './Wrappers';
import { faThumbTack } from '@fortawesome/pro-solid-svg-icons';
export const Pinned = () => (
  <>
    <Subheading>
      <FontAwesomeIcon icon={faThumbTack} transform="shrink-3" />
      Pinned Chain State
    </Subheading>
    <Results withSpacer={false} />
  </>
);

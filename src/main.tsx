// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Network themes
import '@polkadot-cloud/core/accent/polkadot-relay.css';

// Default template fonts.
import '@polkadot-cloud/core/theme/default/fonts/index.css';

// Default template theme.
import '@polkadot-cloud/core/theme/default/index.css';

// Polkadot Cloud core styles.
import '@polkadot-cloud/core/css/styles/index.css';

import ReactDOM from 'react-dom/client';
import { Providers } from './Providers';

ReactDOM.createRoot(document.getElementById('root')!).render(<Providers />);

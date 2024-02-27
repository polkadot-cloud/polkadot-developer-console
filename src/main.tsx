// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Network themes from Polkadot Cloud.
import 'theme/accents/polkadot-relay.css';

// Default template fonts.
import 'theme/fonts.css';

// Default template theme.
import 'theme/theme.css';

// Polkadot Cloud core styles.
import 'theme/index.css';

import ReactDOM from 'react-dom/client';
import { Providers } from './Providers';

ReactDOM.createRoot(document.getElementById('root')!).render(<Providers />);

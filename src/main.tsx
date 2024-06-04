// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Network themes from Polkadot Cloud.
import 'styles/accents/developer-console.css';

// Default template fonts.
import 'styles/fonts.css';

// Default template theme.
import 'styles/theme.css';

// Core styles.
import 'styles/index.css';

// Library styles.
import 'library/Overlay/index.scss';

// Animations
import 'styles/animations.css';

import ReactDOM from 'react-dom/client';
import { Providers } from './Providers';

ReactDOM.createRoot(document.getElementById('root')!).render(<Providers />);

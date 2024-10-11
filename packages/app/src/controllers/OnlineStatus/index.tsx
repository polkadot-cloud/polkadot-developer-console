// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export class OnlineStatusController {
  // Set up online / offline event listeners. Relays information to `document` for the UI to handle.
  static initOnlineEvents() {
    window.addEventListener('offline', async () => {
      this.dispatchEvent(false);
    });
    window.addEventListener('online', () => {
      this.dispatchEvent(true);
    });
  }

  // Dispatch an `online-status` event.
  static dispatchEvent(online: boolean) {
    document.dispatchEvent(
      new CustomEvent('online-status', {
        detail: {
          online,
        },
      })
    );
  }
}

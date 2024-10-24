// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { SubscriptionsController } from 'controllers/Subscriptions';
import type {
  ObservableGetter,
  Subscription,
} from 'controllers/Subscriptions/types';
import type { ApiInstanceId } from 'model/Api/types';

// Gets a result from an Observable class asynchronously, and adds the process to the subscriptions
// controller. This ensures that the process is tidied up if the API is terminated before the
// subscription is resolved.
export const getDataFromObservable = async (
  instanceId: ApiInstanceId,
  subscriptionKey: string,
  getter: Subscription
) => {
  // Instantiate chain spec observable and add it to subscriptions in case the Api is terminated
  // before the subscription is resolved.
  SubscriptionsController.set(instanceId, subscriptionKey, getter);

  // Get the observable immediately and await subscribe() to resolve with chain spec data.
  const result = await (
    SubscriptionsController.get(instanceId, subscriptionKey) as ObservableGetter
  ).get();

  // Remove the subscription from the controller.
  SubscriptionsController.remove(instanceId, subscriptionKey);
  return result;
};

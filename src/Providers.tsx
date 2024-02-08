import { App } from 'App';
import { TabsProvider } from 'contexts/Tabs';
import type { Provider } from 'hooks/withProviders';
import { withProviders } from 'hooks/withProviders';

export const Providers = () => {
  // !! Provider order matters.
  const providers: Provider[] = [TabsProvider];

  return withProviders(providers, App);
};

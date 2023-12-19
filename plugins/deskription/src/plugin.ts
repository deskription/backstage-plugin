import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const deskriptionPlugin = createPlugin({
  id: 'deskription',
  routes: {
    root: rootRouteRef,
  },
});

export const DeskriptionPage = deskriptionPlugin.provide(
  createRoutableExtension({
    name: 'DeskriptionPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

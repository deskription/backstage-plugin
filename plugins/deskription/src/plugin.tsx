import {
  ApiBlueprint,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

import {
  builtInResourceDefinitions,
  InMemoryKubernetesColumnsApi,
  kubernetesColumnsApiRef,
} from './api';

const KUBERNETES_ANNOTATIONS = [
  'backstage.io/kubernetes-id',
  'backstage.io/kubernetes-namespace',
  'backstage.io/kubernetes-label-selector',
];

/**
 * Provides the resource-type / column definitions. For now this is an in-memory
 * implementation seeded with the definitions bundled with the plugin.
 */
const kubernetesColumnsApi = ApiBlueprint.make({
  name: 'kubernetes-columns',
  params: defineParams =>
    defineParams({
      api: kubernetesColumnsApiRef,
      deps: {},
      factory: () =>
        new InMemoryKubernetesColumnsApi(builtInResourceDefinitions),
    }),
});

/**
 * A tab on the catalog entity page that lists the Kubernetes objects related to
 * the entity, with a dropdown to switch between resource types. Only shown for
 * entities that carry a `backstage.io/kubernetes-*` annotation.
 */
export const entityKubernetesResourcesContent = EntityContentBlueprint.make({
  name: 'resources',
  params: {
    path: '/deskription-resources',
    title: 'Kubernetes',
    filter: entity =>
      KUBERNETES_ANNOTATIONS.some(
        annotation => !!entity.metadata.annotations?.[annotation],
      ),
    loader: () =>
      import('./components/KubernetesResources').then(m => (
        <m.KubernetesResources />
      )),
  },
});

export const deskriptionPlugin = createFrontendPlugin({
  pluginId: 'deskription',
  extensions: [kubernetesColumnsApi, entityKubernetesResourcesContent],
});

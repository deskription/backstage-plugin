import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

const KUBERNETES_ANNOTATIONS = [
  'backstage.io/kubernetes-id',
  'backstage.io/kubernetes-namespace',
  'backstage.io/kubernetes-label-selector',
];

/**
 * A tab on the catalog entity page that lists the Kubernetes pods related to
 * the entity. Only shown for entities that carry a `backstage.io/kubernetes-*`
 * annotation.
 */
export const entityKubernetesPodsContent = EntityContentBlueprint.make({
  name: 'pods',
  params: {
    path: '/deskription-pods',
    title: 'Pods',
    filter: entity =>
      KUBERNETES_ANNOTATIONS.some(
        annotation => !!entity.metadata.annotations?.[annotation],
      ),
    loader: () =>
      import('./components/KubernetesPods').then(m => <m.KubernetesPods />),
  },
});

export const deskriptionPlugin = createFrontendPlugin({
  pluginId: 'deskription',
  extensions: [entityKubernetesPodsContent],
});

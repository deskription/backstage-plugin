import { createApiRef } from '@backstage/frontend-plugin-api';

import { ResourceTypeDefinition } from './types';

/**
 * Provides the resource-type and column definitions used to render Kubernetes
 * objects in the catalog entity tab.
 *
 * The current implementation is in-memory ({@link InMemoryKubernetesColumnsApi}),
 * seeded with definitions when the plugin is created. Later this can be swapped
 * for an implementation that loads the definitions from YAML — from a local file
 * on the Backstage cluster, through a Backstage SCM reader, or from the
 * Kubernetes cluster itself — without changing any consumers.
 */
export interface KubernetesColumnsApi {
  /** All configured resource types, in display order. */
  getResourceTypes(): ResourceTypeDefinition[];

  /** The definition for a given Kubernetes type, if configured. */
  getResourceType(type: string): ResourceTypeDefinition | undefined;
}

/** @public */
export const kubernetesColumnsApiRef = createApiRef<KubernetesColumnsApi>({
  id: 'plugin.deskription.kubernetes-columns',
});

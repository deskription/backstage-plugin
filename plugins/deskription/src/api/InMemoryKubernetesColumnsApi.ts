import { KubernetesColumnsApi } from './KubernetesColumnsApi';
import { ResourceTypeDefinition } from './types';

/**
 * In-memory {@link KubernetesColumnsApi} backed by definitions provided at
 * construction time.
 *
 * This is the initial implementation: the definitions are bundled with the
 * plugin and handed in when the plugin is created. A future implementation can
 * load the same shape of data from YAML on the cluster, via an SCM reader, or
 * from the Kubernetes cluster.
 */
export class InMemoryKubernetesColumnsApi implements KubernetesColumnsApi {
  private readonly definitions: ResourceTypeDefinition[];
  private readonly byType: Map<string, ResourceTypeDefinition>;

  constructor(definitions: ResourceTypeDefinition[]) {
    this.definitions = definitions;
    this.byType = new Map(definitions.map(d => [d.type, d]));
  }

  getResourceTypes(): ResourceTypeDefinition[] {
    return this.definitions;
  }

  getResourceType(type: string): ResourceTypeDefinition | undefined {
    return this.byType.get(type);
  }
}

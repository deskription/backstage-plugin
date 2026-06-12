import { InMemoryKubernetesColumnsApi } from './InMemoryKubernetesColumnsApi';
import { builtInResourceDefinitions } from './definitions';

describe('InMemoryKubernetesColumnsApi', () => {
  const api = new InMemoryKubernetesColumnsApi(builtInResourceDefinitions);

  it('returns all configured resource types in order', () => {
    const types = api.getResourceTypes().map(t => t.type);
    expect(types).toContain('pods');
    expect(types).toContain('deployments');
    expect(types[0]).toBe('pods');
  });

  it('looks up a single resource type definition', () => {
    const pods = api.getResourceType('pods');
    expect(pods?.label).toBe('Pods');
    expect(pods?.columns.map(c => c.id)).toContain('name');
  });

  it('returns undefined for unknown types', () => {
    expect(api.getResourceType('does-not-exist')).toBeUndefined();
  });
});

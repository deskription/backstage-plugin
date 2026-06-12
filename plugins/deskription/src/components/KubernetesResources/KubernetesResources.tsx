import { useState } from 'react';

import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { kubernetesApiRef } from '@backstage/plugin-kubernetes-react';
import { Container, Flex, Select, Text } from '@backstage/ui';
import useAsync from 'react-use/esm/useAsync';

import { kubernetesColumnsApiRef } from '../../api';
import { ResourceTable, type ResourceRow } from '../ResourceTable';

/**
 * Catalog entity tab that lists the Kubernetes objects related to the entity.
 *
 * The objects for the entity are fetched once; a dropdown then selects which
 * resource type to display. Which columns are shown comes entirely from the
 * {@link kubernetesColumnsApiRef} definitions, so adding a type is a matter of
 * configuration rather than code.
 */
export const KubernetesResources = () => {
  const { entity } = useEntity();
  const kubernetesApi = useApi(kubernetesApiRef);
  const columnsApi = useApi(kubernetesColumnsApiRef);

  const resourceTypes = columnsApi.getResourceTypes();
  const [selectedType, setSelectedType] = useState(
    resourceTypes[0]?.type ?? '',
  );

  const {
    value: response,
    loading,
    error,
  } = useAsync(
    () => kubernetesApi.getObjectsByEntity({ entity }),
    [kubernetesApi, entity],
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const definition = columnsApi.getResourceType(selectedType);

  const rows: ResourceRow[] = [];
  for (const clusterObjects of response?.items ?? []) {
    const cluster = clusterObjects.cluster.title ?? clusterObjects.cluster.name;
    for (const fetched of clusterObjects.resources) {
      if (fetched.type !== selectedType) {
        continue;
      }
      fetched.resources.forEach((resource, index) => {
        const metadata =
          (resource as { metadata?: { name?: string; namespace?: string } })
            .metadata ?? {};
        rows.push({
          id: `${cluster}/${metadata.namespace ?? ''}/${
            metadata.name ?? index
          }`,
          resource: resource as Record<string, unknown>,
        });
      });
    }
  }

  return (
    <Container>
      <Flex direction="column" gap="4">
        <Select
          label="Resource type"
          options={resourceTypes.map(type => ({
            value: type.type,
            label: type.label,
          }))}
          selectedKey={selectedType}
          onSelectionChange={key => setSelectedType(String(key))}
        />
        {definition ? (
          <ResourceTable columns={definition.columns} rows={rows} />
        ) : (
          <Text>No column definition configured for "{selectedType}".</Text>
        )}
      </Flex>
    </Container>
  );
};

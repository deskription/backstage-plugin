import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { kubernetesApiRef } from '@backstage/plugin-kubernetes-react';
import { Container } from '@backstage/ui';
import useAsync from 'react-use/esm/useAsync';

import { PodList, type PodRow } from '../PodList';

/**
 * Fetches the pods related to the current catalog entity (based on its
 * `backstage.io/kubernetes-*` annotations) across all configured clusters and
 * renders them in a table.
 */
export const KubernetesPods = () => {
  const { entity } = useEntity();
  const kubernetesApi = useApi(kubernetesApiRef);

  const {
    value: pods,
    loading,
    error,
  } = useAsync(async (): Promise<PodRow[]> => {
    const response = await kubernetesApi.getObjectsByEntity({ entity });

    const rows: PodRow[] = [];
    for (const clusterObjects of response.items) {
      const cluster =
        clusterObjects.cluster.title ?? clusterObjects.cluster.name;

      for (const resource of clusterObjects.resources) {
        if (resource.type !== 'pods') {
          continue;
        }

        for (const pod of resource.resources) {
          const containers = pod.status?.containerStatuses ?? [];
          const ready = containers.filter(c => c.ready).length;
          const restarts = containers.reduce(
            (sum, c) => sum + (c.restartCount ?? 0),
            0,
          );

          rows.push({
            id: `${cluster}/${pod.metadata?.namespace ?? ''}/${
              pod.metadata?.name ?? ''
            }`,
            name: pod.metadata?.name ?? 'unknown',
            namespace: pod.metadata?.namespace ?? '',
            cluster,
            status: pod.status?.phase ?? 'Unknown',
            ready: `${ready}/${containers.length}`,
            restarts,
            createdAt: pod.metadata?.creationTimestamp
              ? new Date(pod.metadata.creationTimestamp).toISOString()
              : undefined,
          });
        }
      }
    }

    return rows;
  }, [kubernetesApi, entity]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Container>
      <PodList pods={pods ?? []} />
    </Container>
  );
};

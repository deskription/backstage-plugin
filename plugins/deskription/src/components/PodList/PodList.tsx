import { Table, useTable, CellText, type ColumnConfig } from '@backstage/ui';

export type PodRow = {
  /** Stable row id, in the form `<cluster>/<namespace>/<name>`. */
  id: string;
  name: string;
  namespace: string;
  cluster: string;
  /** Pod lifecycle phase, e.g. `Running`, `Pending`, `Succeeded`. */
  status: string;
  /** Ready containers over total containers, e.g. `1/1`. */
  ready: string;
  restarts: number;
  /** Creation timestamp of the pod, used to render its age. */
  createdAt?: string;
};

const columns: ColumnConfig<PodRow>[] = [
  {
    id: 'name',
    label: 'Name',
    cell: item => <CellText title={item.name} />,
  },
  {
    id: 'namespace',
    label: 'Namespace',
    cell: item => <CellText title={item.namespace} />,
  },
  {
    id: 'cluster',
    label: 'Cluster',
    cell: item => <CellText title={item.cluster} />,
  },
  {
    id: 'status',
    label: 'Status',
    cell: item => <CellText title={item.status} />,
  },
  {
    id: 'ready',
    label: 'Ready',
    cell: item => <CellText title={item.ready} />,
  },
  {
    id: 'restarts',
    label: 'Restarts',
    cell: item => <CellText title={String(item.restarts)} />,
  },
  {
    id: 'createdAt',
    label: 'Age',
    cell: item => (
      <CellText
        title={item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
      />
    ),
  },
];

export const PodList = ({ pods }: { pods: PodRow[] }) => {
  const { tableProps } = useTable({
    mode: 'complete',
    data: pods,
    paginationOptions: { pageSize: pods.length || 1 },
  });

  return (
    <Table columnConfig={columns} {...tableProps} pagination={{ type: 'none' }} />
  );
};

import { Table, useTable, CellText, type ColumnConfig } from '@backstage/ui';

import type { ColumnDefinition } from '../../api';

/** A single row, wrapping the raw Kubernetes resource object. */
export type ResourceRow = {
  /** Stable row id. */
  id: string;
  /** The raw Kubernetes resource that columns are resolved against. */
  resource: Record<string, unknown>;
};

/** Resolves a dot-separated path (e.g. `metadata.name`) within an object. */
export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** Formats a resolved value for display according to the column's format. */
export function formatValue(
  value: unknown,
  format?: ColumnDefinition['format'],
): string {
  if (value === undefined || value === null) {
    return '—';
  }
  if (format === 'datetime') {
    return new Date(value as string).toLocaleString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * A generic, definition-driven table. The columns are resolved from the given
 * {@link ColumnDefinition}s against each row's raw Kubernetes resource, so the
 * same component renders any resource type.
 */
export const ResourceTable = ({
  columns,
  rows,
}: {
  columns: ColumnDefinition[];
  rows: ResourceRow[];
}) => {
  const columnConfig: ColumnConfig<ResourceRow>[] = columns.map((column, index) => ({
    id: column.id,
    label: column.label,
    cell: row => (
      <CellText
        title={formatValue(getByPath(row.resource, column.path), column.format)}
      />
    ),
    isRowHeader: index === 0,
  }));

  const { tableProps } = useTable({
    mode: 'complete',
    data: rows,
    paginationOptions: { pageSize: rows.length || 1 },
  });

  return (
    <Table
      columnConfig={columnConfig}
      {...tableProps}
      pagination={{ type: 'none' }}
    />
  );
};

import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';

import {
  ResourceTable,
  getByPath,
  formatValue,
  type ResourceRow,
} from './ResourceTable';
import type { ColumnDefinition } from '../../api';

describe('getByPath', () => {
  it('resolves nested paths and returns undefined for missing keys', () => {
    const obj = { metadata: { name: 'web-0' } };
    expect(getByPath(obj, 'metadata.name')).toBe('web-0');
    expect(getByPath(obj, 'metadata.namespace')).toBeUndefined();
    expect(getByPath(obj, 'spec.nodeName')).toBeUndefined();
  });
});

describe('formatValue', () => {
  it('renders a placeholder for missing values', () => {
    expect(formatValue(undefined)).toBe('—');
    expect(formatValue(null)).toBe('—');
  });

  it('formats datetime values', () => {
    expect(formatValue('2025-01-01T00:00:00.000Z', 'datetime')).toBe(
      new Date('2025-01-01T00:00:00.000Z').toLocaleString(),
    );
  });

  it('stringifies objects and primitives', () => {
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
    expect(formatValue(3)).toBe('3');
    expect(formatValue(true)).toBe('true');
  });
});

describe('ResourceTable', () => {
  it('renders columns resolved from the definitions', async () => {
    const columns: ColumnDefinition[] = [
      { id: 'name', label: 'Name', path: 'metadata.name' },
      { id: 'status', label: 'Status', path: 'status.phase' },
    ];
    const rows: ResourceRow[] = [
      {
        id: 'r1',
        resource: { metadata: { name: 'web-0' }, status: { phase: 'Running' } },
      },
    ];

    await renderInTestApp(<ResourceTable columns={columns} rows={rows} />);

    expect(await screen.findByText('Name')).toBeInTheDocument();
    expect(await screen.findByText('Status')).toBeInTheDocument();
    expect(await screen.findByText('web-0')).toBeInTheDocument();
    expect(await screen.findByText('Running')).toBeInTheDocument();
  });
});

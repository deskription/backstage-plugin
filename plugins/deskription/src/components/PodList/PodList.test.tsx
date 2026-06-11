import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { PodList, type PodRow } from './PodList';

describe('PodList', () => {
  it('renders a list of pods', async () => {
    const pods: PodRow[] = [
      {
        id: 'dev/ns/web-0',
        name: 'web-0',
        namespace: 'ns',
        cluster: 'dev',
        status: 'Running',
        ready: '1/1',
        restarts: 0,
        createdAt: '2025-01-01T00:00:00.000Z',
      },
      {
        id: 'dev/ns/worker-0',
        name: 'worker-0',
        namespace: 'ns',
        cluster: 'dev',
        status: 'Pending',
        ready: '0/1',
        restarts: 2,
      },
    ];

    await renderInTestApp(<PodList pods={pods} />);

    expect(await screen.findByText('web-0')).toBeInTheDocument();
    expect(await screen.findByText('worker-0')).toBeInTheDocument();
    expect(await screen.findByText('Running')).toBeInTheDocument();
    expect(await screen.findByText('Pending')).toBeInTheDocument();
  });
});

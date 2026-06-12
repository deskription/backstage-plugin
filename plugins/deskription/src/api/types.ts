/**
 * A single column rendered in the resource table.
 */
export type ColumnDefinition = {
  /** Stable column id. */
  id: string;
  /** Header label. */
  label: string;
  /**
   * Dot-separated accessor into the Kubernetes resource object,
   * e.g. `metadata.name` or `status.phase`.
   */
  path: string;
  /**
   * Optional value formatting.
   * - `datetime` renders an ISO timestamp as a localized date/time string.
   * - `text` (default) renders the value as-is.
   */
  format?: 'text' | 'datetime';
};

/**
 * Describes one selectable Kubernetes resource type and the columns to show for
 * it.
 */
export type ResourceTypeDefinition = {
  /**
   * The Kubernetes resource type, matching the type returned by the Kubernetes
   * backend, e.g. `pods`, `deployments`, `cronjobs`, `jobs`, `configmaps`,
   * `secrets`, `services`.
   */
  type: string;
  /** Human-readable label shown in the type dropdown. */
  label: string;
  /** Columns to render for this resource type. */
  columns: ColumnDefinition[];
};

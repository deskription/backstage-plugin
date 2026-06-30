import { Entity } from '@backstage/catalog-model';

/**
 * The apiVersion of all Deskription definitions.
 *
 * @public
 */
export const DESKRIPTION_API_VERSION = 'deskription.io/v1alpha1';

/**
 * Selects the Kubernetes resource kind a Deskription definition applies to.
 * All fields are matched exactly in v1alpha1.
 *
 * @public
 */
export type ResourceSelector = {
  /**
   * API group of the target resource, e.g. 'apps' or 'tekton.dev'.
   * The literal 'core' and the empty string are equivalent and select the
   * Kubernetes core group.
   */
  apiGroup: string;
  /**
   * API version of the target resource, e.g. 'v1' or 'v1beta1'.
   */
  apiVersion: string;
  /**
   * Kind of the target resource, e.g. 'Deployment'.
   */
  kind: string;
};

/**
 * Category of a selected resource kind. Open enum: any string is allowed so
 * new categories do not require a spec change.
 *
 * @public
 */
export type ResourceCategory =
  | 'Workload'
  | 'Storage'
  | 'Data'
  | 'RBAC'
  | 'CICD'
  | 'Compute'
  | 'Network'
  | 'Operators'
  | (string & {});

/**
 * How a column or field value is rendered. Defaults to 'string'.
 *
 * @public
 */
export type ResourceValueType =
  | 'string'
  | 'status'
  | 'conditions'
  | 'sum'
  | 'owners'
  | 'memory'
  | 'cpu'
  | 'datetime';

/**
 * Rendering hint for a column width. Defaults to 'default'.
 *
 * @public
 */
export type ResourceColumnWidth = 'short' | 'default' | 'wide';

/**
 * A column of a {@link ResourceTableEntityV1alpha1} or of a nested table in a
 * {@link ResourceDetailsEntityV1alpha1} field.
 *
 * @public
 */
export type ResourceColumn = {
  /**
   * Column header shown to the user. Columns are merged across definitions by
   * this name. Some names without a path are well known to renderers
   * (Name, Namespace, Labels, Annotations, Created, Owner, Status).
   */
  name: string;
  /**
   * JSONPath into the rendered resource that provides the value, e.g.
   * 'metadata.name' or 'status.containerStatuses.*.restartCount'.
   * The leading '$.' is optional.
   */
  path?: string;
  type?: ResourceValueType;
  width?: ResourceColumnWidth;
};

/**
 * A field on the detail view defined by a {@link ResourceDetailsEntityV1alpha1}.
 * Fields with type 'table' render a nested table and require the 'table'
 * property.
 *
 * @public
 */
export type ResourceDetailsField =
  | {
      /**
       * Label of the field shown to the user. Fields are merged across
       * definitions by this name. Some names without a path are well known to
       * renderers (Name, Namespace, Labels, Annotations, Created at, Owner,
       * Status).
       */
      name: string;
      /**
       * JSONPath into the rendered resource that provides the value, e.g.
       * 'metadata.name'. The leading '$.' is optional.
       */
      path?: string;
      type?: ResourceValueType;
    }
  | {
      name: string;
      path?: string;
      type: 'table';
      /**
       * Nested table definition (e.g. the containers of a Pod).
       */
      table: {
        columns: ResourceColumn[];
      };
    };

/**
 * Classifies a Kubernetes resource kind for UIs: which kind is meant
 * (selector) and which category it belongs to (type).
 *
 * @public
 */
export interface ResourceEntityV1alpha1 extends Entity {
  apiVersion: 'deskription.io/v1alpha1';
  kind: 'Resource';
  spec: {
    selector: ResourceSelector;
    type: ResourceCategory;
  };
}

/**
 * Defines the columns a UI should render when listing resources of the
 * selected kind.
 *
 * @public
 */
export interface ResourceTableEntityV1alpha1 extends Entity {
  apiVersion: 'deskription.io/v1alpha1';
  kind: 'ResourceTable';
  spec: {
    selector: ResourceSelector;
    columns: ResourceColumn[];
  };
}

/**
 * Defines the fields a UI should render on the detail view of a single
 * resource of the selected kind.
 *
 * @public
 */
export interface ResourceDetailsEntityV1alpha1 extends Entity {
  apiVersion: 'deskription.io/v1alpha1';
  kind: 'ResourceDetails';
  spec: {
    selector: ResourceSelector;
    fields: ResourceDetailsField[];
  };
}

/**
 * Any Deskription definition: Resource, ResourceTable, or ResourceDetails.
 *
 * @public
 */
export type DeskriptionEntityV1alpha1 =
  | ResourceEntityV1alpha1
  | ResourceTableEntityV1alpha1
  | ResourceDetailsEntityV1alpha1;

/**
 * @public
 */
export function isResourceEntity(
  entity: Entity,
): entity is ResourceEntityV1alpha1 {
  return (
    entity.apiVersion === DESKRIPTION_API_VERSION && entity.kind === 'Resource'
  );
}

/**
 * @public
 */
export function isResourceTableEntity(
  entity: Entity,
): entity is ResourceTableEntityV1alpha1 {
  return (
    entity.apiVersion === DESKRIPTION_API_VERSION &&
    entity.kind === 'ResourceTable'
  );
}

/**
 * @public
 */
export function isResourceDetailsEntity(
  entity: Entity,
): entity is ResourceDetailsEntityV1alpha1 {
  return (
    entity.apiVersion === DESKRIPTION_API_VERSION &&
    entity.kind === 'ResourceDetails'
  );
}

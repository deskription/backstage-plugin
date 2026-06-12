# deskription

Welcome to the deskription plugin!

This plugin adds a **Kubernetes** tab to the catalog entity page that lists the
Kubernetes objects related to the current entity. A dropdown switches between
resource types (Pods, Deployments, Services, CronJobs, Jobs, ConfigMaps,
Secrets, …).

## How it works

The tab is contributed as an `EntityContentBlueprint` extension built on
Backstage's [frontend
system](https://backstage.io/docs/frontend-system/architecture/index). It uses
the `kubernetesApiRef` from `@backstage/plugin-kubernetes-react` to call
`getObjectsByEntity`, which resolves the objects for an entity based on its
Kubernetes annotations.

The tab is only shown for entities that carry one of the following annotations:

- `backstage.io/kubernetes-id`
- `backstage.io/kubernetes-namespace`
- `backstage.io/kubernetes-label-selector`

### Column definitions

Which columns are shown for each resource type comes from an extendable mapping,
served by the `kubernetesColumnsApiRef` API. The current implementation,
`InMemoryKubernetesColumnsApi`, is seeded when the plugin is created with the
JSON definitions in [`src/api/definitions`](./src/api/definitions). Each
definition declares the Kubernetes `type`, a `label`, and the `columns`
(`{ id, label, path, format? }`) where `path` is a dot-path into the resource.

Adding or changing a column is therefore configuration, not code. To add a new
resource type, add a JSON file and reference it from
`src/api/definitions/index.ts`.

This API is the seam for future work: the same `KubernetesColumnsApi` interface
can be backed by an implementation that loads the definitions from YAML — from a
local file on the Backstage cluster, through a Backstage SCM reader, or from the
Kubernetes cluster — without touching the UI.

## Getting started

The plugin is wired into the app in this repository via `packages: all`
discovery, so running `yarn start` from the root directory and opening an entity
with a Kubernetes annotation will show the **Kubernetes** tab.

Kubernetes clusters are configured under the `kubernetes` key in your
`app-config`; see the [Kubernetes configuration
docs](https://backstage.io/docs/features/kubernetes/configuration).

You can also serve the plugin in isolation by running `yarn start` in the plugin
directory. The setup for it can be found inside the [/dev](./dev) directory.

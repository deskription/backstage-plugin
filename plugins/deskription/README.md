# deskription

Welcome to the deskription plugin!

This plugin adds a **Pods** tab to the catalog entity page that lists the
Kubernetes pods related to the current entity, across all configured clusters.

## How it works

The tab is contributed as an `EntityContentBlueprint` extension built on
Backstage's [frontend
system](https://backstage.io/docs/frontend-system/architecture/index). It uses
the `kubernetesApiRef` from `@backstage/plugin-kubernetes-react` to call
`getObjectsByEntity`, which resolves the pods for an entity based on its
Kubernetes annotations.

The tab is only shown for entities that carry one of the following annotations:

- `backstage.io/kubernetes-id`
- `backstage.io/kubernetes-namespace`
- `backstage.io/kubernetes-label-selector`

## Getting started

The plugin is wired into the app in this repository via `packages: all`
discovery, so running `yarn start` from the root directory and opening an entity
with a Kubernetes annotation will show the **Pods** tab.

Kubernetes clusters are configured under the `kubernetes` key in your
`app-config`; see the [Kubernetes configuration
docs](https://backstage.io/docs/features/kubernetes/configuration).

You can also serve the plugin in isolation by running `yarn start` in the plugin
directory. The setup for it can be found inside the [/dev](./dev) directory.

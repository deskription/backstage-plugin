import { ResourceTypeDefinition } from '../types';

import configmaps from './configmaps.json';
import cronjobs from './cronjobs.json';
import deployments from './deployments.json';
import jobs from './jobs.json';
import pods from './pods.json';
import secrets from './secrets.json';
import services from './services.json';

/**
 * Built-in resource-type / column definitions bundled with the plugin.
 *
 * For now these live as JSON in the frontend and are passed to the in-memory
 * {@link InMemoryKubernetesColumnsApi} when the plugin is created. Later this
 * configuration is intended to be loaded from YAML files — from a local file on
 * the Backstage cluster, through a Backstage SCM reader, or from the Kubernetes
 * cluster.
 */
export const builtInResourceDefinitions = [
  pods,
  deployments,
  services,
  cronjobs,
  jobs,
  configmaps,
  secrets,
] as ResourceTypeDefinition[];

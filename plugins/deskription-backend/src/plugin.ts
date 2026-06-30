import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { todoListServiceRef } from './services/TodoListService';

/**
 * deskriptionPlugin backend plugin
 *
 * @public
 */
export const deskriptionPlugin = createBackendPlugin({
  pluginId: 'deskription',
  register(env) {
    env.registerInit({
      deps: {
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        todoList: todoListServiceRef,
      },
      async init({ httpAuth, httpRouter, todoList }) {
        httpRouter.use(
          await createRouter({
            httpAuth,
            todoList,
          }),
        );
      },
    });
  },
});

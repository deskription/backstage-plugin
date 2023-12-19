import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { deskriptionPlugin, DeskriptionPage } from '../src/plugin';

createDevApp()
  .registerPlugin(deskriptionPlugin)
  .addPage({
    element: <DeskriptionPage />,
    title: 'Root Page',
    path: '/deskription'
  })
  .render();

import '@tsed/swagger';
import '@tsed/platform-express';
import { Inject } from '@tsed/di';
import { PlatformApplication, Configuration } from '@tsed/common';
import express from 'express';
import path from 'path';

const rootDir = path.resolve(__dirname);

@Configuration({
  rootDir,
  acceptMimes: ['application/json'],
  swagger: [
    {
      path: '/v3/docs',
      specVersion: '3.0.1',
    },
  ],
  mount: {
    '/api': '${rootDir}/controllers/*.ts',
  },
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.use(express.json());
  }
}

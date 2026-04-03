import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController({
      getHello: () => 'Hello World!',
    } as any);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

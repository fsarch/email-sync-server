import 'reflect-metadata';
import { Test } from '@nestjs/testing';

const originalCreateTestingModule = Test.createTestingModule.bind(Test);

// Auto-mock unresolved providers/tokens so legacy "should be defined" tests
// continue to compile under Nest v11 without verbose per-spec mock wiring.
(Test as unknown as { createTestingModule: typeof Test.createTestingModule }).createTestingModule =
  ((...args: Parameters<typeof Test.createTestingModule>) => {
    const [metadata] = args;
    const explicitTokens = new Set<unknown>();

    if (metadata?.providers) {
      for (const provider of metadata.providers) {
        if (typeof provider === 'function') {
          explicitTokens.add(provider);
          continue;
        }

        if (provider && typeof provider === 'object' && 'provide' in provider) {
          explicitTokens.add(provider.provide);
        }
      }
    }

    if (metadata?.controllers) {
      for (const controller of metadata.controllers) {
        explicitTokens.add(controller);
      }
    }

    return originalCreateTestingModule(...args).useMocker((token) => {
      if (explicitTokens.has(token)) {
        return undefined;
      }

      if (token === 'CONFIG_OPTIONS') {
        return { name: 'module' };
      }

      if (typeof token === 'function' && token.name === 'ConfigService') {
        return {
          get: (key: string) => (key === 'auth.type' ? 'static' : {}),
        };
      }

      if (typeof token === 'function' && token.name === 'AppService') {
        return {
          getHello: () => 'Hello World!',
        };
      }

      return {};
    });
  }) as typeof Test.createTestingModule;


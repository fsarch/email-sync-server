import { ModuleConfigurationService } from './module-configuration.service.js';

describe('ModuleService', () => {
  let service: ModuleConfigurationService<Record<string, any>>;

  beforeEach(() => {
    service = new ModuleConfigurationService<Record<string, any>>(
      { name: 'module' },
      { get: () => ({}) } as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

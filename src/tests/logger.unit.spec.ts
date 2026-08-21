import { resolveEnabled, resolveLevel, resolveTransport } from '@shared/infra/logger';

describe('logger config resolvers', () => {
  describe('resolveLevel', () => {
    it('uses "info" in production', () => {
      expect(resolveLevel('production')).toBe('info');
    });

    it('uses "debug" outside production', () => {
      expect(resolveLevel('development')).toBe('debug');
      expect(resolveLevel(undefined)).toBe('debug');
    });
  });

  describe('resolveEnabled', () => {
    it('disables logging in the test environment', () => {
      expect(resolveEnabled('test')).toBe(false);
    });

    it('enables logging outside the test environment', () => {
      expect(resolveEnabled('production')).toBe(true);
      expect(resolveEnabled('development')).toBe(true);
    });
  });

  describe('resolveTransport', () => {
    it('disables the pretty-printer in production', () => {
      expect(resolveTransport('production')).toBeUndefined();
    });

    it('enables the pretty-printer outside production', () => {
      expect(resolveTransport('development')).toEqual({
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
      });
    });
  });
});

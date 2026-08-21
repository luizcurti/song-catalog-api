import pino from 'pino';

export function resolveLevel(nodeEnv: string | undefined): string {
  return nodeEnv === 'production' ? 'info' : 'debug';
}

export function resolveEnabled(nodeEnv: string | undefined): boolean {
  return nodeEnv !== 'test';
}

export function resolveTransport(nodeEnv: string | undefined): pino.TransportSingleOptions | undefined {
  if (nodeEnv === 'production') {
    return undefined;
  }

  return {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
  };
}

export const logger = pino({
  level: resolveLevel(process.env.NODE_ENV),
  enabled: resolveEnabled(process.env.NODE_ENV),
  transport: resolveTransport(process.env.NODE_ENV),
});

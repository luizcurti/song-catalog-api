export class AppError extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly data: Record<string, unknown>;

  constructor(message = '', code = 400, type = '', data: Record<string, unknown> = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.type = type;
    this.data = data;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

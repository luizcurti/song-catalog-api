import { AppError } from '@errors/appError';

describe('AppError', () => {
  it('behaves like a standard Error', () => {
    const error = new AppError('Something went wrong', 404, 'NOT_FOUND', { id: '1' });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe(404);
    expect(error.type).toBe('NOT_FOUND');
    expect(error.data).toEqual({ id: '1' });
    expect(error.stack).toBeDefined();
  });

  it('applies default values when none are provided', () => {
    const error = new AppError();

    expect(error.message).toBe('');
    expect(error.code).toBe(400);
    expect(error.type).toBe('');
    expect(error.data).toEqual({});
  });
});

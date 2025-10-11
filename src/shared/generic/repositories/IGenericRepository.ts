import { DeepPartial, FindManyOptions } from 'typeorm';

interface IGenericRepository<T, ID = string> {
  create(data: DeepPartial<T>): Promise<T>;
  findByID(id: ID, relations?: string[]): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  update(obj: DeepPartial<T>): Promise<T>;
  remove(obj: T): Promise<void>;
}

export { IGenericRepository };

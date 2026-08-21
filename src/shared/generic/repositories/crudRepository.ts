import { DeepPartial } from 'typeorm';

export interface CrudRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  findByID(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(obj: DeepPartial<T>): Promise<T>;
  remove(obj: T): Promise<void>;
}

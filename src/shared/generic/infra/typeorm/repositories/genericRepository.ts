import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

import { AppDataSource } from '@shared/infra/database/dataSource';
import { CrudRepository } from '@shared/generic/repositories/crudRepository';

export class GenericRepository<T extends ObjectLiteral> implements CrudRepository<T> {
  protected readonly repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findByID(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async update(obj: DeepPartial<T>): Promise<T> {
    return this.repository.save(obj);
  }

  async remove(obj: T): Promise<void> {
    await this.repository.remove(obj);
  }
}

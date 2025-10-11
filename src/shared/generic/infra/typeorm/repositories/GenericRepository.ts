import { IGenericRepository } from '@shared/generic/repositories/IGenericRepository';
import { getConnection, Repository, DeepPartial, FindManyOptions, EntityTarget, ObjectLiteral } from 'typeorm';

class GenericRepository<T extends ObjectLiteral> implements IGenericRepository<T> {
  private repository: Repository<T>;

  constructor(entity: EntityTarget<T>, connectionName = 'default') {
    this.repository = getConnection(connectionName).getRepository(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const el = this.repository.create(data) as T;
    return await this.repository.save(el as DeepPartial<T>); 
  }

  async findByID(id: string, relations: string[] = []): Promise<T | null> {
    const result = await this.repository.findOne({
      where: { id } as any,
      relations,
    });
    return result || null;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async update(obj: DeepPartial<T>): Promise<T> {
    return this.repository.save(obj);
  }

  async remove(obj: T): Promise<void> {
    await this.repository.remove(obj); 
  }
}

export { GenericRepository };

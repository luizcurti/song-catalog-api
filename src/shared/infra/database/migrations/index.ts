import { QueryRunner } from 'typeorm';

class CreateDatabase  {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('music', true)
  }
}

export default new CreateDatabase();

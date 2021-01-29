import { EntityRepository, Repository } from 'typeorm';
import { MallType } from '../entities/mallType.entity';

@EntityRepository(MallType)
export class MallTypeRepository extends Repository<MallType> {
  async getOrCreate(name: string): Promise<MallType> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.findOne({ slug: categorySlug });
    if (!category) {
      category = await this.save(
        this.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }
}

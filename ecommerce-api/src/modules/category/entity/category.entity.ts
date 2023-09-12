import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeLevelColumn,
  TreeParent,
} from 'typeorm';
import { ICategory } from '../interfaces/category.interface';
import { Product } from 'src/modules/product/entity/product.entity';

@Entity()
@Tree('materialized-path')
export class Category implements ICategory {
  /**
   * The ID of the category. Generated automatically by the UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The name of the category.
   */
  @Column()
  @Index()
  name: string;

  /**
   * The description of the category.
   */
  @Column()
  description: string;

  /**
   * Specify the children of the entity.
   */
  @TreeChildren()
  children: Category[];

  /**
   * Specify the parent of the entity.
   */
  @TreeParent({ onDelete: 'CASCADE' })
  @Index()
  parent: Category;

  /**
   * Specify the level of the entity in the tree structure.
   */
  @TreeLevelColumn()
  @Column()
  level: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
  
}

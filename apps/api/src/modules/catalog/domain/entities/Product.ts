import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProductCategory } from './ProductCategory.js';
import { Transaction } from '../../../sales/domain/entities/Transaction.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ name: 'category_id', type: 'int' })
  categoryId!: number;

  @ManyToOne(() => ProductCategory, (category) => category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: ProductCategory;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions!: Transaction[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

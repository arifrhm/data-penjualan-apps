import { AppDataSource } from './data-source.js';
import { ProductCategory } from '../../modules/catalog/domain/entities/ProductCategory.js';
import { Product } from '../../modules/catalog/domain/entities/Product.js';
import { Transaction } from '../../modules/sales/domain/entities/Transaction.js';

export async function seedDatabase() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Database connected. Starting seed...');

  const categoryRepo = AppDataSource.getRepository(ProductCategory);
  const productRepo = AppDataSource.getRepository(Product);
  const transactionRepo = AppDataSource.getRepository(Transaction);

  // Clear existing data (in reverse dependency order)
  await transactionRepo.delete({});
  await productRepo.delete({});
  await categoryRepo.delete({});

  // 1. Create Categories
  const konsumsiCat = categoryRepo.create({ name: 'Konsumsi' });
  const pembersihCat = categoryRepo.create({ name: 'Pembersih' });
  await categoryRepo.save([konsumsiCat, pembersihCat]);
  console.log('Categories created.');

  // 2. Create Products with final current stock after all transactions
  const kopi = productRepo.create({ name: 'Kopi', stock: 75, categoryId: konsumsiCat.id });
  const teh = productRepo.create({ name: 'Teh', stock: 76, categoryId: konsumsiCat.id });
  const pastaGigi = productRepo.create({ name: 'Pasta Gigi', stock: 80, categoryId: pembersihCat.id });
  const sabunMandi = productRepo.create({ name: 'Sabun Mandi', stock: 70, categoryId: pembersihCat.id });
  const sampo = productRepo.create({ name: 'Sampo', stock: 75, categoryId: pembersihCat.id });

  await productRepo.save([kopi, teh, pastaGigi, sabunMandi, sampo]);
  console.log('Products created.');

  // 3. Create Transactions according to prompt
  // Dates formatted as YYYY-MM-DD
  const seedTransactions = [
    { product: kopi, quantitySold: 10, transactionDate: '2021-05-01', stockAtTransaction: 100 },
    { product: teh, quantitySold: 19, transactionDate: '2021-05-05', stockAtTransaction: 100 },
    { product: kopi, quantitySold: 15, transactionDate: '2021-05-10', stockAtTransaction: 90 },
    { product: pastaGigi, quantitySold: 20, transactionDate: '2021-05-11', stockAtTransaction: 100 },
    { product: sabunMandi, quantitySold: 30, transactionDate: '2021-05-11', stockAtTransaction: 100 },
    { product: sampo, quantitySold: 25, transactionDate: '2021-05-12', stockAtTransaction: 100 },
    { product: teh, quantitySold: 5, transactionDate: '2021-05-12', stockAtTransaction: 81 },
  ];

  const transactions = seedTransactions.map((st) =>
    transactionRepo.create({
      productId: st.product.id,
      quantitySold: st.quantitySold,
      transactionDate: st.transactionDate,
      stockAtTransaction: st.stockAtTransaction,
    })
  );

  await transactionRepo.save(transactions);
  console.log('Seed completed successfully with 7 transactions!');

  await AppDataSource.destroy();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

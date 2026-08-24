import { createApp } from './app.js';
import { AppDataSource } from './core/database/data-source.js';
import { config } from './core/config/index.js';

async function bootstrap() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connected successfully.');

    const app = createApp();
    app.listen(config.port, () => {
      console.log(`🚀 Server listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

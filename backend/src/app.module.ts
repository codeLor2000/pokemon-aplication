import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';

import { User } from './user/entities/user.entity';
import { Pokemon } from './pokemon/entities/pokemon.entity';

@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database configuration - PostgreSQL first if DATABASE_URL provided, otherwise SQLite
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        // PostgreSQL configuration (if DATABASE_URL is provided)
        if (databaseUrl) {
          console.log('🐘 Using PostgreSQL database');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Pokemon],
            synchronize: !isProduction, // Enable synchronize for development
            ssl: isProduction ? { rejectUnauthorized: false } : false,
            logging: configService.get('NODE_ENV') === 'development',
          };
        }
        
        // SQLite configuration (fallback)
        console.log('📁 Using SQLite database');
        return {
          type: 'sqlite',
          database: configService.get('DATABASE_PATH', 'pokemon.db'),
          entities: [User, Pokemon],  
          synchronize: true, // Only for development
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    
    // Serve static files (for uploaded images)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    
    // Feature modules
    AuthModule,
    PokemonModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 
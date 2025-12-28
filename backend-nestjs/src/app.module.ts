import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // 환경 변수 글로벌 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

// TypeORM 설정 (SQLite for testing, MySQL for production)   
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DATABASE_TYPE') || 'mysql';
        
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite' as const,
            database: config.get<string>('DATABASE_NAME') || 'eoullim_test.db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: config.get<string>('DATABASE_SYNCHRONIZE') === 'true',
            logging: config.get<string>('NODE_ENV') === 'development',
          };
        } else {
          return {
            type: 'mysql' as const,
            host: config.get<string>('DATABASE_HOST'),
            port: parseInt(config.get<string>('DATABASE_PORT') || '3306'),
            username: config.get<string>('DATABASE_USER'),
            password: config.get<string>('DATABASE_PASSWORD'),
            database: config.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: config.get<string>('DATABASE_SYNCHRONIZE') === 'true',
            logging: config.get<string>('NODE_ENV') === 'development',
            timezone: 'Z',
          };
        }
      },
    }),

    // 캐싱 설정 (Spring ConcurrentMapCache와 동일)
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 60초
    }),

    UsersModule,
    PostsModule,
    CommentsModule,
    MessagesModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
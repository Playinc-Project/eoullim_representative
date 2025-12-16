import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    // 환경 변수 글로벌 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM 설정 (Spring과 동일)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DATABASE_HOST'),
        port: +config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('DATABASE_SYNCHRONIZE') === 'true',
        timezone: '+09:00', // Asia/Seoul
        logging: config.get('NODE_ENV') === 'development',
      }),
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
  ],
})
export class AppModule {}

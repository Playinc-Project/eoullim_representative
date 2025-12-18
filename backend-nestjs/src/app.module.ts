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

    // TypeORM 설정 (SQLite 인메모리 - Spring H2와 동일한 역할)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: ':memory:', // 인메모리 데이터베이스 (H2와 동일)
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 개발용 자동 스키마 동기화
        logging: config.get('NODE_ENV') === 'development',
        dropSchema: true, // 재시작 시 스키마 초기화 (H2 모드와 동일)
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
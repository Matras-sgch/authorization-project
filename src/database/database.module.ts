import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get<string>('PG_DATABASE'),
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASS'),
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT') || 5432,
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
        entities: [UserEntity],
      }),
    }),
  ],
})
export class DatabaseModule {}

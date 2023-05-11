// import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import {ConfigType} from '@nestjs/config';

// import { AuthService } from './services/auth.service';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { UsersModule } from './../users/users.module';
// import { AuthController } from './controllers/auth.controllers';
// import config from './../config';

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     JwtModule.registerAsync({
//       inject: [config.KEY],
//       useFactory: (configService: ConfigType<typeof config>) => {
//         return {
//           secret: configService.jwtSecret,
//           signOptions: {
//             expiresIn: '10d',
//           },
//         };
//       },
//     }),
//   ],
//   providers: [AuthService, JwtStrategy],
//   controllers: [AuthController],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from './../users/users.module';
import { AuthController } from './controllers/auth.controller';
import config from './../config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
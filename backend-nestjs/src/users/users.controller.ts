import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDTO, LoginRequestDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 회원가입: POST /api/users/signup
  @Post('signup')
  async signup(@Body() requestDTO: UserRequestDTO) {
    console.log('💻 회원가입 요청 데이터:', JSON.stringify(requestDTO));
    try {
      const user = await this.usersService.signup(requestDTO);
      return user;
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      const message = error instanceof Error ? error.message : '회원가입 요청이 올바르지 않습니다.';
      if (message.includes('이미 존재하는 이메일')) {
        throw new HttpException({ error: message }, HttpStatus.CONFLICT);
      }
      throw new HttpException({ error: message }, HttpStatus.BAD_REQUEST);
    }
  }

  // 로그인: POST /api/users/login
  @Post('login')
  async login(@Body() loginRequest: LoginRequestDTO) {
    try {
      const user = await this.usersService.login(
        loginRequest.email,
        loginRequest.password,
      );
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      throw new HttpException({ error: message }, HttpStatus.UNAUTHORIZED);
    }
  }

  // 전체 사용자 목록 조회: GET /api/users
  @Get()
  async getAllUsers() {
    try {
      return await this.usersService.getAllUsers();
    } catch (error) {
      const message = error instanceof Error ? error.message : '사용자 목록 조회에 실패했습니다.';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 사용자 조회: GET /api/users/{id}
  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      return await this.usersService.getUserById(+id);
    } catch (error) {
      throw new HttpException({ error: '사용자를 찾을 수 없습니다' }, HttpStatus.NOT_FOUND);
    }
  }

  // 이메일로 사용자 존재 확인: GET /api/users/email/{email}
  @Get('email/:email')
  async checkEmail(@Param('email') email: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new HttpException({ error: '사용자를 찾을 수 없습니다' }, HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : '요청이 올바르지 않습니다.';
      throw new HttpException({ error: message }, HttpStatus.BAD_REQUEST);
    }
  }

  // 사용자 정보 수정: PUT /api/users/{id}
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() requestDTO: UserRequestDTO,
  ) {
    try {
      return await this.usersService.updateUser(+id, requestDTO);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '사용자 수정에 실패했습니다';
      throw new HttpException({ error: message }, HttpStatus.BAD_REQUEST);
    }
  }

  // 사용자 삭제: DELETE /api/users/{id}
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.usersService.deleteUser(+id);
      return null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '사용자 삭제에 실패했습니다';
      throw new HttpException({ error: message }, HttpStatus.BAD_REQUEST);
    }
  }
}

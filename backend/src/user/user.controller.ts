import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get current user profile
   */
  @Get('profile')
  async getProfile(@Request() req: any) {
    return req.user;
  }

  /**
   * Get all users (admin endpoint)
   */
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  /**
   * Admin test endpoint for smoke testing
   */
  @Get('admin/test')
  getAdminTest(): { message: string; status: string } {
    return {
      message: 'User admin test endpoint working',
      status: 'OK',
    };
  }
} 
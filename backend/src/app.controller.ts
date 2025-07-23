import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   */
  @Get()
  getHealth(): { message: string; timestamp: string } {
    return this.appService.getHealth();
  }

  /**
   * Admin test endpoint for smoke testing
   */
  @Get('admin/test')
  getAdminTest(): { message: string; status: string } {
    return this.appService.getAdminTest();
  }
} 
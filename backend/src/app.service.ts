import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Get application health status
   */
  getHealth(): { message: string; timestamp: string } {
    return {
      message: 'Pokemon API is running successfully!',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Admin test endpoint for smoke testing
   */
  getAdminTest(): { message: string; status: string } {
    return {
      message: 'Admin test endpoint working',
      status: 'OK',
    };
  }
} 
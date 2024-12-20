import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const sig = req.headers['stripe-signature'];

    return this.stripeService.handleWebhook(req, res, sig);
  }
}

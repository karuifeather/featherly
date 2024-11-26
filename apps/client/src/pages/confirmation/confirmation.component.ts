import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

enum ConfirmationToken {
  EMAIL_CONFIRMED = '5f4dcc3b5aa765d61d8327deb882cf99',
  PASSWORD_RESET = '6adfb183a4a2c94a2f92dab5ade762a2',
  ACCOUNT_ACTIVATION = '8d3d3d68a19945b3ac914c0f24d52aef',
}

@Component({
  selector: 'app-confirmation',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent implements OnInit {
  message = 'Processing...';
  token: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to the queryParams to extract the token
    this.route.queryParams.subscribe((params) => {
      this.token = params['token']; // Extract the 'token' parameter
      this.handleTokenType();
    });
  }

  handleTokenType(): void {
    switch (this.token) {
      case ConfirmationToken.EMAIL_CONFIRMED:
        this.message = 'Your email has been successfully confirmed!';
        break;
      case ConfirmationToken.PASSWORD_RESET:
        this.message = 'Your password has been reset successfully!';
        break;
      case ConfirmationToken.ACCOUNT_ACTIVATION:
        this.message = 'Your account is now active!';
        break;
      default:
        this.message = 'Invalid or expired token.';
    }
  }
}

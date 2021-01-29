import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.scss']
})
export class ConfirmSignupComponent implements OnInit {
  loading: boolean;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private userService: UserService
  ) {
    // redirects if token is missing from url
    if (!this.route.snapshot.queryParams.token) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.token = this.route.snapshot.queryParams.token;
    this.userService.confirmSignup(this.token)
      .subscribe({
        next: () => {
          this.dialogService.openInfoDialog('Konto zostało aktywowane',
            'Twoje konto zostało aktywowane pomyślnie. Możesz się teraz na nie zalogować.',
            true , '/login');
        },
        error: () => {
          this.dialogService.openInfoDialog('Wystąpił błąd podczas aktywacji konta',
            '',
            true , '/');
        }
      });
  }

}

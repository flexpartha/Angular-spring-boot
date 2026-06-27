import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginService } from '../service/google-login.service';
import { Store } from '@ngrx/store';
import { googleLoginStart, googleLoginSuccess, loginSuccess, refreshFail, refreshStart } from '../state/auth.action';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [],
  templateUrl: './google-callback.html',
  styleUrl: './google-callback.css',
})
export class GoogleCallback implements OnInit {

  private store = inject(Store);
    private router = inject(Router);

    ngOnInit(): void {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        // This will trigger the effect chain we are about to add.
        this.store.dispatch(googleLoginStart({ code }));
      } else {
        // No code – something went wrong, send the user back to the login page.
        this.router.navigate(['/login']);
      }
    }
}

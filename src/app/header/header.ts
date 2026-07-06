import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { logout } from '../auth/state/auth.action';
import { AuthState } from '../auth/state/auth.state';
import { AuthEffects } from '../auth/state/auth.effects';
import { LanguageService, AppLang } from '../core/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  _getUserName: string = '';
  langService = inject(LanguageService);

  constructor(private store: Store<AuthState>, private authService: AuthEffects) {
    this._getUserName = sessionStorage.getItem('userName') || '';
  }

  setLang(lang: AppLang) {
    this.langService.use(lang);
  }

  onLogout() {
    sessionStorage.clear();
    //localStorage.clear();
    this.store.dispatch(logout());
  }
}

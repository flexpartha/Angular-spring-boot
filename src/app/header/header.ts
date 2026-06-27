import { Component, signal } from '@angular/core';import { Store } from '@ngrx/store';
import { logout } from '../auth/state/auth.action';
import { AuthState } from '../auth/state/auth.state';
import { Authservice } from '../auth/service/authservice';
import { AuthEffects } from '../auth/state/auth.effects';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
    
    _getUserName:string = '';

    constructor(private store: Store<AuthState>,
        private authService: AuthEffects
    ) { 
        this._getUserName = sessionStorage.getItem('userName') || '';
    }

    onLogout() {
        sessionStorage.clear();
        this.store.dispatch(logout());
    }
}

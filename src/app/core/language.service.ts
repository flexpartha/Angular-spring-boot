import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type AppLang = 'en' | 'fr' | 'sv';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly supported: AppLang[] = ['en', 'fr', 'sv'];
  readonly activeLang = signal<AppLang>('en');

  constructor(private translate: TranslateService) {}

  async init(): Promise<void> {
    this.translate.addLangs(this.supported);
    this.translate.setDefaultLang('en');
    const saved = (localStorage.getItem('lang') as AppLang) ?? 'en';
    await this.use(saved);
  }

  async use(lang: AppLang): Promise<void> {
    await firstValueFrom(this.translate.use(lang));
    this.activeLang.set(lang);
    localStorage.setItem('lang', lang);
  }
}

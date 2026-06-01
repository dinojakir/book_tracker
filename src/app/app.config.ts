import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { Database } from './db/types';

export const SUPABASE = new InjectionToken<SupabaseClient>('SUPABASE');

export const supabaseProvider = {
  provide: SUPABASE,
  useFactory: () =>
    createClient<Database>(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    )
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    supabaseProvider
  ]
};

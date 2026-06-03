import { Component, inject, signal } from '@angular/core';
import { SUPABASE } from './app.config';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('book_tracker');
  private supabase = inject(SUPABASE);
}

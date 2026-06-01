import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SUPABASE } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('book_tracker');
  private supabase = inject(SUPABASE);
}

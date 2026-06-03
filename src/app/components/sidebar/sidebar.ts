import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  newArea = '';

  addArea() {
    if (this.newArea.trim()) {
      console.log('Add area', this.newArea);
      this.newArea = '';
    }
  }
}

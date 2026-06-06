import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Area, AreaInsert, AreasService } from '../../db/areas.service';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar implements OnInit {
  private readonly areaService = inject(AreasService);

  allAreas = signal<Area[]>([]);
  newArea = signal('');

  ngOnInit(): void {
    this.getAreas();
  }

  async addArea() {
    const name = this.newArea().trim();

    if (!name) return;

    const payload: AreaInsert = {
      name,
      parent_id: null,
    };

    try {
      await this.areaService.create(payload);
      this.newArea.set('');
    } catch (error) {
      console.error(error);
    }
  }

  async getAreas() {
    try {
      const areas = await this.areaService.getAll();
      this.allAreas.set(areas);

      console.log(areas);
    } catch (error) {
      console.error(error);
    }
  }

  updateNewArea(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.newArea.set(value);
  }
}

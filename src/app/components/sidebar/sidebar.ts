import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Area, AreaInsert, AreasService } from '../../db/areas.service';
import {
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';

type AreaNode = Area & { expanded: boolean };

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar implements OnInit {
  private readonly areaService = inject(AreasService);

  allAreas = signal<Area[]>([]);
  areaNodes = signal<AreaNode[]>([]);
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
      this.newArea.set('');
      await this.areaService.create(payload);
      await this.getAreas();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteArea(area: AreaNode) {
    try {
      await this.areaService.delete(area.id);
      await this.getAreas();
    } catch (error) {
      console.error(error);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    const items = [...this.areaNodes()];

    moveItemInArray(items, event.previousIndex, event.currentIndex);

    this.areaNodes.set(items); // important for signals
  }

  async getAreas() {
    try {
      const areas = await this.areaService.getAll();

      this.allAreas.set(areas);
      this.areaNodes.set(areas.map((i) => ({ ...i, expanded: false })));
    } catch (error) {
      console.error(error);
    }
  }

  toggleNodeExpanded(node: AreaNode) {
    node.expanded = !node.expanded;
    this.areaNodes.set([...this.areaNodes()]);
  }

  updateNewArea(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.newArea.set(value);
  }
}

import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Area, AreaInsert, AreasService } from '../../db/areas.service';
import {
  CdkDropList,
  CdkDrag,
  CdkDragHandle,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

type AreaNode = Area & { expanded: boolean; addSubarea: boolean };

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar implements OnInit {
  @ViewChildren('subareaInput') subareaInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private readonly areaService = inject(AreasService);

  activeSubareaAreaId: string | null = null;
  areaNodes = signal<AreaNode[]>([]);
  newArea = signal('');
  newSubarea = signal('');

  ngOnInit(): void {
    this.getAreas();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.activeSubareaAreaId) return;

    const inputs = this.subareaInputs?.toArray();
    if (!inputs?.length) return;

    const index = this.areaNodes().findIndex((a) => a.id === this.activeSubareaAreaId);

    const activeInput = inputs[index]?.nativeElement;
    if (!activeInput) return;

    const target = event.target as Node;

    if (activeInput.contains(target)) return;

    this.closeSubarea();
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

  async addSubarea(area: AreaNode) {
    const name = this.newSubarea().trim();

    if (!name) return;

    const payload: AreaInsert = {
      name,
      parent_id: area.id,
    };

    try {
      this.newSubarea.set('');
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

      this.areaNodes.set(areas.map((i) => ({ ...i, expanded: false, addSubarea: false })));
    } catch (error) {
      console.error(error);
    }
  }

  showAddSubarea(node: AreaNode) {
    this.activeSubareaAreaId = node.id;

    this.areaNodes.set(
      this.areaNodes().map((n) =>
        n.id === node.id
          ? {
              ...n,
              expanded: true,
              addSubarea: true,
            }
          : n,
      ),
    );
  }

  toggleNodeExpanded(node: AreaNode) {
    this.areaNodes.set(
      this.areaNodes().map((n) => (n.id === node.id ? { ...n, expanded: !n.expanded } : n)),
    );
  }

  updateNewArea(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.newArea.set(value);
  }

  updateNewSubarea(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.newSubarea.set(value);
  }

  private closeSubarea() {
    const id = this.activeSubareaAreaId;
    if (!id) return;

    const nodes = this.areaNodes();

    this.areaNodes.set(
      nodes.map((area) => (area.id === id ? { ...area, addSubarea: false } : area)),
    );

    this.activeSubareaAreaId = null;
    this.newSubarea.set('');
  }
}

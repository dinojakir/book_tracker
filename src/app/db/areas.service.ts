import { Injectable, inject } from '@angular/core';
import { SUPABASE } from '../app.config';
import { Database } from './types';

export type Area = Database['public']['Tables']['areas']['Row'];
export type AreaInsert = Database['public']['Tables']['areas']['Insert'];
type AreaUpdate = Database['public']['Tables']['areas']['Update'];

@Injectable({ providedIn: 'root' })
export class AreasService {
  private supabase = inject(SUPABASE);

  async getAll(): Promise<Area[]> {
    const { data, error } = await this.supabase
      .from('areas')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getById(id: string): Promise<Area | null> {
    const { data, error } = await this.supabase.from('areas').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  }

  async create(area: AreaInsert): Promise<Area> {
    const { data, error } = await this.supabase.from('areas').insert(area).select().single();

    if (error) throw error;
    return data;
  }

  async update(id: string, area: AreaUpdate): Promise<Area> {
    const { data, error } = await this.supabase
      .from('areas')
      .update(area)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('areas').delete().eq('id', id);

    if (error) throw error;
  }

  async getRootAreas(): Promise<Area[]> {
    const { data, error } = await this.supabase.from('areas').select('*').is('parent_id', null);

    if (error) throw error;
    return data ?? [];
  }

  async getChildren(parentId: string): Promise<Area[]> {
    const { data, error } = await this.supabase.from('areas').select('*').eq('parent_id', parentId);

    if (error) throw error;
    return data ?? [];
  }

  async getTree(): Promise<(Area & { children: Area[] })[]> {
    const { data, error } = await this.supabase.from('areas').select('*');

    if (error) throw error;

    const areas = data ?? [];

    const map = new Map<string, Area & { children: Area[] }>();

    areas.forEach((a) => map.set(a.id, { ...a, children: [] }));

    const roots: (Area & { children: Area[] })[] = [];

    for (const area of map.values()) {
      if (area.parent_id) {
        map.get(area.parent_id)?.children.push(area);
      } else {
        roots.push(area);
      }
    }

    return roots;
  }
}

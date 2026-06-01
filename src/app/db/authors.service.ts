import { Injectable, inject } from '@angular/core';
import { SUPABASE } from '../app.config';
import { Database } from './types';

type Author = Database['public']['Tables']['authors']['Row'];
type AuthorInsert = Database['public']['Tables']['authors']['Insert'];

@Injectable({ providedIn: 'root' })
export class AuthorsService {

    private supabase = inject(SUPABASE);

    async getAll(): Promise<Author[]> {
        const { data, error } = await this.supabase
            .from('authors')
            .select('*');

        if (error) throw error;
        return data ?? [];
    }

    async create(author: AuthorInsert): Promise<Author> {
        const { data, error } = await this.supabase
            .from('authors')
            .insert(author)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}
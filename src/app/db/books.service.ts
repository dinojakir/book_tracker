import { Injectable, inject } from '@angular/core';
import { SUPABASE } from '../app.config';
import { Database } from './types';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

@Injectable({ providedIn: 'root' })
export class BooksService {

    private supabase = inject(SUPABASE);

    async getAll(): Promise<Book[]> {
        const { data, error } = await this.supabase
            .from('books')
            .select('*');

        if (error) throw error;
        return data ?? [];
    }

    async getById(id: string): Promise<Book | null> {
        const { data, error } = await this.supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async create(book: BookInsert): Promise<Book> {
        const { data, error } = await this.supabase
            .from('books')
            .insert(book)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async update(id: string, book: BookUpdate): Promise<Book> {
        const { data, error } = await this.supabase
            .from('books')
            .update(book)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('books')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}
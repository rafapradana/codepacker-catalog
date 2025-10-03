import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCategories, createCategory } from '@/lib/categories';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori tidak boleh kosong').max(100, 'Nama kategori terlalu panjang'),
  bgHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna background tidak valid'),
  borderHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna border tidak valid'),
  textHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna text tidak valid'),
});

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body with Zod
    const validatedData = createCategorySchema.parse(body);
    
    const category = await createCategory(validatedData);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Gagal membuat kategori' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Data tidak valid',
          errors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat kategori' },
      { status: 500 }
    );
  }
}
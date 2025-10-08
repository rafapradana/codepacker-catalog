import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/categories';

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori tidak boleh kosong').max(100, 'Nama kategori terlalu panjang').optional(),
  bgHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna background tidak valid').optional(),
  borderHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna border tidak valid').optional(),
  textHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format warna text tidak valid').optional(),
});

const idSchema = z.string().uuid('ID kategori tidak valid');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedId = idSchema.parse(params.id);
    
    const category = await getCategoryById(validatedId);
    
    if (!category) {
      return NextResponse.json(
        { message: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'ID kategori tidak valid' },
        { status: 400 }
      );
    }
    
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedId = idSchema.parse(params.id);
    const body = await request.json();
    
    // Validate request body with Zod
    const validatedData = updateCategorySchema.parse(body);
    
    // Check if category exists
    const existingCategory = await getCategoryById(validatedId);
    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const updatedCategory = await updateCategory(validatedId, validatedData);
    
    if (!updatedCategory) {
      return NextResponse.json(
        { message: 'Gagal memperbarui kategori' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedCategory);
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
    
    console.error('Error updating category:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memperbarui kategori' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedId = idSchema.parse(params.id);
    
    // Check if category exists
    const existingCategory = await getCategoryById(validatedId);
    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const success = await deleteCategory(validatedId);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Gagal menghapus kategori' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Kategori berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'ID kategori tidak valid' },
        { status: 400 }
      );
    }
    
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat menghapus kategori' },
      { status: 500 }
    );
  }
}
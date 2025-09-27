
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '../../config';



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  return NextResponse.json({ test: 'Route works!', id: params.id });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    console.log('DELETE route called for ID:', id);
    
    const res = await fetch(`${BACKEND_URL}/menu-items/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to delete' },
        { status: res.status }
      );
    }
    
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    console.log('PATCH route called for ID:', id);
    
    const res = await fetch(`${BACKEND_URL}/menu-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to update' },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Patch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
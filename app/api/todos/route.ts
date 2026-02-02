import { NextResponse } from 'next/server';
import { openDB } from '@/lib/todos-db';

export async function GET() {
  try {
    const db = await openDB();
    
    return new Promise((resolve) => {
      const transaction = db.transaction('todos', 'readonly');
      const store = transaction.objectStore('todos');
      const request = store.getAll();

      request.onerror = () => {
        resolve(NextResponse.json({ error: 'Failed to get todos' }, { status: 500 }));
      };
      request.onsuccess = () => {
        const todos = request.result;
        resolve(NextResponse.json(todos));
      };
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// apps/frontend/lib/menuSlice.ts
'use client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Node = { id: string; name: string; depth: number; children: Node[] };

export const fetchMenus = createAsyncThunk('menus/list', async () => {
  const res = await fetch('/api/menus', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch menus');
  return (await res.json()) as { id: string; name: string }[];
});

export const fetchTree = createAsyncThunk('menus/tree', async (menuId: string) => {
  const res = await fetch(`/api/menus/${menuId}/tree`);
  if (!res.ok) throw new Error('Failed to fetch tree');
  return (await res.json()) as Node;
});

export const addChild = createAsyncThunk(
  'menus/addChild', 
  async ({ menuId, parentId, name }: { menuId: string; parentId?: string; name: string }) => {
    const res = await fetch(`/api/menus/${menuId}/items`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ parentId, name }) 
    });
    if (!res.ok) throw new Error('Failed to add child');
    return (await res.json()) as { id: string };
  }
);

export const renameNode = createAsyncThunk(
  'menus/rename', 
  async ({ id, name }: { id: string; name: string }) => {
    const res = await fetch(`/api/menu-items/${id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name }) 
    });
    if (!res.ok) throw new Error('Failed to rename node');
    return { id, name };
  }
);

export const deleteNode = createAsyncThunk(
  'menus/delete', 
  async (id: string) => {
    const res = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete node');
    }
    return id;
  }
);

type State = { 
  menus: { id: string; name: string }[]; 
  selectedMenuId?: string; 
  tree?: Node; 
  loading: boolean;
  error?: string;
};

const initial: State = { menus: [], loading: false };

const slice = createSlice({
  name: 'menu',
  initialState: initial,
  reducers: {
    selectMenu(state, action: PayloadAction<string>) { 
      state.selectedMenuId = action.payload; 
    },
    clearError(state) {
      state.error = undefined;
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchMenus.pending, (s) => { 
      s.loading = true; 
      s.error = undefined;
    })
    .addCase(fetchMenus.fulfilled, (s, a) => { 
      s.loading = false; 
      s.menus = a.payload; 
      s.selectedMenuId ??= a.payload[0]?.id; 
    })
    .addCase(fetchMenus.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message;
    })
    .addCase(fetchTree.fulfilled, (s, a) => { 
      s.tree = a.payload; 
    })
    .addCase(fetchTree.rejected, (s, a) => {
      s.error = a.error.message;
    })
    .addCase(renameNode.fulfilled, (s, a) => {
      const walk = (n?: Node) => { 
        if (!n) return; 
        if (n.id === a.payload.id) n.name = a.payload.name; 
        n.children.forEach(walk); 
      };
      walk(s.tree);
    })
    .addCase(renameNode.rejected, (s, a) => {
      s.error = a.error.message;
    })
    .addCase(deleteNode.fulfilled, (s, a) => {
      const drop = (n?: Node) => { 
        if (!n) return false; 
        n.children = n.children.filter(c => !drop(c)); 
        return n.id === a.payload; 
      };
      if (s.tree) { 
        drop(s.tree); 
      }
    })
    .addCase(deleteNode.rejected, (s, a) => {
      s.error = a.error.message;
    });
  }
});

export const { selectMenu, clearError } = slice.actions;
export default slice.reducer;
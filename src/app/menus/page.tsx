'use client';
import { useEffect } from 'react';
import Tree from '../../../components/Tree';
import Sidebar from '../../../components/Sidebar';
import Topbar from '../../../components/Topbar';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchTree } from '../../../lib/menuSlice';

export default function Page() {
  const dispatch = useAppDispatch();
  const { selectedMenuId, tree } = useAppSelector(s => s.menu);

  useEffect(() => {
    if (selectedMenuId) dispatch(fetchTree(selectedMenuId));
  }, [selectedMenuId, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar - Fixed */}
        <Topbar />
        
        {/* Main Content - Scrollable */}
       <div className="flex-1 overflow-y-auto w-full scrollbar-hide">
  <div className="p-6">
    <div className="bg-white">
      <Tree root={tree} />
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
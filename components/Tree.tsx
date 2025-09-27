'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Trash2, Edit3, Check, X, Plus, Grid3x3, Menu, Folder } from 'lucide-react';
import { Node, deleteNode, renameNode, addChild, fetchMenus, fetchTree, selectMenu } from '../lib/menuSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

interface FormData {
  id?: string;
  name: string;
  depth: number;
  parentId?: string;
  parentName: string;
  menuId: string;
  isEdit: boolean;
}

function Item({
  node,
  level = 0,
  expandedNodes,
  toggleNode,
  onEdit,
  onAdd,
  isLast = false,
  parentLines = []
}: {
  node: Node;
  level?: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  onEdit: (node: Node, level: number) => void;
  onAdd: (parentNode: Node, level: number) => void;
  isLast?: boolean;
  parentLines?: boolean[];
}) {
  const dispatch = useAppDispatch();
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  const getIndentStyle = (level: number) => {
    return { paddingLeft: `${level * 28}px` };
  };

  const renderConnector = () => {
    if (level === 0) return null;

    return (
      <>
        {/* Vertical lines for parent levels */}
        {parentLines.map((showLine, index) => (
          showLine && index < level - 1 && (
            <div
              key={index}
              className="absolute top-0 bottom-0 border-l border-gray-300"
              style={{ 
                left: `${index * 28 + 14}px`,
              }}
            />
          )
        ))}
        
        {/* Vertical line for current level */}
        <div
          className="absolute border-l border-gray-300"
          style={{ 
            left: `${(level - 1) * 28 + 14}px`,
            top: 0,
            height: isLast ? '16px' : '100%'
          }}
        />
        
        {/* Horizontal line */}
        <div
          className="absolute border-b border-gray-300"
          style={{ 
            left: `${(level - 1) * 28 + 14}px`,
            width: '12px',
            top: '16px'
          }}
        />
      </>
    );
  };

  // Calculate which parent lines should be shown for children
  const childParentLines = [...parentLines];
  if (level > 0) {
    childParentLines[level - 1] = !isLast;
  }

  return (
    <div className="relative">
      {renderConnector()}

      <div 
        className="relative flex items-center py-2 hover:bg-gray-50 rounded-lg group transition-colors duration-150"
        style={getIndentStyle(level)}
      >
        <div className="flex items-center gap-2 flex-1 min-h-[32px]">
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button 
              className="flex items-center justify-center w-5 h-5 hover:bg-gray-200 rounded transition-colors z-10"
              onClick={() => toggleNode(node.id)}
            >
              {isExpanded ? (
                <ChevronDown size={14} className="text-gray-600" />
              ) : (
                <ChevronRight size={14} className="text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          {/* Node Content */}
          <div className="flex items-center gap-2 flex-1">
            <Folder size={16} className="text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-700 select-none flex-1">
              {node.name}
            </span>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onAdd(node, level)}
                className="w-5 h-5 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                title="Add Child"
              >
                <Plus size={12} className="text-white" />
              </button>
              <button
                onClick={() => onEdit(node, level)}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => dispatch(deleteNode(node.id))}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Children - Full expandable without height restrictions */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {node.children?.map((child, index) => (
            <Item
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onEdit={onEdit}
              onAdd={onAdd}
              isLast={index === node.children!.length - 1}
              parentLines={childParentLines}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EditForm({ 
  formData, 
  onSave, 
  onCancel 
}: { 
  formData: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(formData.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, name });
  };

  return (
    <div className="lg:w-80 bg-white lg:p-6 w-full p-4 lg:mt-40 lg:ml-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Menu ID
          </label>
          <input
            type="text"
            value={formData.menuId}
            readOnly
            className="w-full px-3 py-2 text-gray-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Depth
          </label>
          <input
            type="number"
            value={formData.depth}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm"
          />
        </div>

        {formData.parentName && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Data
            </label>
            <input
              type="text"
              value={formData.parentName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter menu name"
            autoFocus
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-full hover:bg-blue-700 transition-colors font-medium"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium lg:hidden"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Tree({ root }: { root?: Node }) {
  const dispatch = useAppDispatch();
  const { menus, selectedMenuId } = useAppSelector(s => s.menu);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    dispatch(fetchMenus()).then(() => {
      if (selectedMenuId) dispatch(fetchTree(selectedMenuId));
    });
  }, [dispatch]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const getAllNodeIds = (node: Node): string[] => {
      const ids = [node.id];
      if (node.children) {
        node.children.forEach(child => {
          ids.push(...getAllNodeIds(child));
        });
      }
      return ids;
    };

    if (root) {
      setExpandedNodes(new Set(getAllNodeIds(root)));
    }
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleEdit = (node: Node, level: number) => {
    setFormData({
      id: node.id,
      name: node.name,
      depth: level + 1,
      parentName: '',
      menuId: selectedMenuId || '',
      isEdit: true
    });
  };

  const handleAdd = (parentNode: Node, level: number) => {
    setFormData({
      name: '',
      depth: level + 2,
      parentId: parentNode.id,
      parentName: parentNode.name,
      menuId: selectedMenuId || '',
      isEdit: false
    });
  };

  const handleFormSave = async (data: FormData) => {
    if (data.isEdit && data.id) {
      await dispatch(renameNode({ id: data.id, name: data.name }));
    } else {
      await dispatch(addChild({ 
        menuId: data.menuId, 
        name: data.name,
        parentId: data.parentId
      }));
    }
    
    if (selectedMenuId) {
      await dispatch(fetchTree(selectedMenuId));
    }
    setFormData(null);
  };

  const handleFormCancel = () => {
    setFormData(null);
  };

  return (
    <div className="min-h-screen ">
      <div className="lg:flex lg:min-h-screen">
        {/* Main Content - Left side on large screens, full width on mobile */}
        <div className="flex-1 lg:flex lg:flex-col bg-white">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-3 p-6 bg-white ">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Grid3x3 size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black">Menus</h1>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {/* Menu Dropdown */}
              <div className="mb-4 lg:mb-6">
                <p className='text-[#475467]' style={{fontWeight:'400',fontFamily:'Plus Jakarta Sans'}}>Menu</p>
                <div className="relative">
                  <select 
                    className="w-full lg:max-w-md px-3 py-2 border border-gray-300 rounded-lg bg-[#F9FAFB] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer text-sm"
                    value={selectedMenuId}
                    onChange={e => {
                      dispatch(selectMenu(e.target.value));
                      dispatch(fetchTree(e.target.value));
                    }}
                  >
                    {menus.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-2 sm:gap-2 md:gap-3 mb-4 sm:mb-4 md:mb-6">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                >
                  Collapse All
                </button>
              </div>

              {/* Tree Structure - Fully expandable */}
              {!root ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <p className="text-slate-500 text-sm">No menu selected.</p>
                    <p className="text-slate-400 text-xs mt-1">Select a menu to view its structure</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white">
                  <div className="p-4">
                    <Item
                      node={root}
                      expandedNodes={expandedNodes}
                      toggleNode={toggleNode}
                      onEdit={handleEdit}
                      onAdd={handleAdd}
                      isLast={true}
                      parentLines={[]}
                    />
                  </div>
                </div>
              )}

              {/* Mobile Form - Shows below tree on mobile */}
              {formData && (
                <div className="lg:hidden mt-4">
                  <EditForm
                    formData={formData}
                    onSave={handleFormSave}
                    onCancel={handleFormCancel}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Form - Right sidebar on large screens */}
        {formData && (
          <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
            <EditForm
              formData={formData}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>

     
    </div>
  );
}
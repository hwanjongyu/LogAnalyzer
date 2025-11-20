import { useState } from 'react';
import { FileText, RotateCw, Filter as FilterIcon, Sun, Moon } from 'lucide-react';
import { LogViewer } from './components/LogViewer';
import { FilterManager } from './components/FilterManager';
import { FilterModal } from './components/FilterModal';
import { useLogStore } from './store/useLogStore';
import { Filter } from './types';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Filter | undefined>();
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState(false);
  const { loadFile, addFilter, updateFilter, filePath, theme, toggleTheme } = useLogStore();

  const handleOpenFile = async () => {
    const result = await window.electronAPI.openFileDialog();
    if (result) {
      loadFile(result.content, result.path);
    }
  };

  const handleReload = async () => {
    if (!filePath) return;

    const result = await window.electronAPI.readFile(filePath);
    if (result.success && result.content) {
      loadFile(result.content, filePath);
    }
  };

  const handleAddFilter = () => {
    setEditingFilter(undefined);
    setIsModalOpen(true);
  };

  const handleEditFilter = (filter: Filter) => {
    setEditingFilter(filter);
    setIsModalOpen(true);
  };

  const handleSaveFilter = (filter: Omit<Filter, 'id'>) => {
    if (editingFilter) {
      updateFilter(editingFilter.id, filter);
    } else {
      addFilter(filter);
    }
    setIsModalOpen(false);
    setEditingFilter(undefined);
  };

  return (
    <div className={`${theme} h-screen w-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden`}>
      {/* Top Menu Bar */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-3 flex-shrink-0">
        <h1 className="text-lg font-semibold">Log Analyzer</h1>

        <div className="flex-1" />

        {filePath && (
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md" title={filePath}>
            {filePath}
          </span>
        )}

        <button
          onClick={() => setShowOnlyHighlighted(!showOnlyHighlighted)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${showOnlyHighlighted
            ? 'bg-green-600 hover:bg-green-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          title={showOnlyHighlighted ? 'Show all lines' : 'Show only highlighted lines'}
        >
          <FilterIcon className="w-4 h-4" />
          {showOnlyHighlighted ? 'Highlighted Only' : 'Show All'}
        </button>

        <button
          onClick={handleReload}
          disabled={!filePath}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-white"
          title="Reload file"
        >
          <RotateCw className="w-4 h-4" />
          Reload
        </button>

        <button
          onClick={handleOpenFile}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
        >
          <FileText className="w-4 h-4" />
          Open File
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Area - 70% */}
      <div className="flex-[7] min-h-0">
        <LogViewer showOnlyHighlighted={showOnlyHighlighted} />
      </div>

      {/* Filter Manager - 30% */}
      <div className="flex-[3] min-h-0">
        <FilterManager onAddFilter={handleAddFilter} onEditFilter={handleEditFilter} />
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFilter(undefined);
        }}
        onSave={handleSaveFilter}
        initialFilter={editingFilter}
      />
    </div>
  );
}

export default App;

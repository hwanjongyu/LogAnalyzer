import { useState } from 'react';
import { Plus, X, Edit2, Power, PowerOff } from 'lucide-react';
import { useLogStore } from '../store/useLogStore';
import { cn } from '../lib/utils';
import { Filter } from '../types';

interface FilterManagerProps {
    onAddFilter: () => void;
    onEditFilter: (filter: Filter) => void;
}

export function FilterManager({ onAddFilter, onEditFilter }: FilterManagerProps) {
    const { tabs, activeTabId, setActiveTab, addTab, removeTab } = useLogStore();
    const { removeFilter, toggleFilter } = useLogStore();
    const [newTabName, setNewTabName] = useState('');
    const [showNewTabInput, setShowNewTabInput] = useState(false);

    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    const handleAddTab = () => {
        if (newTabName.trim()) {
            addTab(newTabName.trim());
            setNewTabName('');
            setShowNewTabInput(false);
        }
    };

    const handleSaveTab = async () => {
        if (!activeTab) return;

        const json = useLogStore.getState().saveTabToJson(activeTabId);
        const filePath = await window.electronAPI.saveFileDialog(`${activeTab.name}.json`);

        if (filePath) {
            await window.electronAPI.writeFile(filePath, json);
        }
    };

    const handleLoadTab = async () => {
        const result = await window.electronAPI.openFileDialog();
        if (result) {
            useLogStore.getState().loadTabFromJson(activeTabId, result.content);
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Tab Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors group',
                            activeTabId === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        )}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="text-sm font-medium">{tab.name}</span>
                        {tab.id !== 'global' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTab(tab.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}

                {showNewTabInput ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={newTabName}
                            onChange={(e) => setNewTabName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTab();
                                if (e.key === 'Escape') {
                                    setShowNewTabInput(false);
                                    setNewTabName('');
                                }
                            }}
                            placeholder="Tab name..."
                            className="px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 w-32"
                            autoFocus
                        />
                        <button
                            onClick={handleAddTab}
                            className="text-green-400 hover:text-green-300 p-1"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowNewTabInput(true)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Tab</span>
                    </button>
                )}
            </div>

            {/* Filter List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Filters ({activeTab?.filters.length || 0})
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLoadTab}
                            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Load Tab
                        </button>
                        <button
                            onClick={handleSaveTab}
                            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Save Tab
                        </button>
                        <button
                            onClick={onAddFilter}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                        >
                            + Add Filter
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {activeTab?.filters.map((filter) => (
                        <div
                            key={filter.id}
                            className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <button
                                    onClick={() => toggleFilter(filter.id)}
                                    className="mt-0.5 flex-shrink-0"
                                >
                                    {filter.enabled ? (
                                        <Power className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <PowerOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className="px-2 py-0.5 rounded text-xs font-mono border"
                                            style={{
                                                color: filter.textColor,
                                                backgroundColor: filter.backgroundColor,
                                                borderColor: filter.textColor,
                                            }}
                                        >
                                            {filter.text}
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-500 uppercase">
                                            {filter.type}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        {filter.isRegex && <span>Regex</span>}
                                        {filter.caseSensitive && <span>Case-sensitive</span>}
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onEditFilter(filter)}
                                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => removeFilter(filter.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!activeTab?.filters || activeTab.filters.length === 0) && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No filters in this tab. Click "Add Filter" to create one.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Filter, FilterType } from '../types';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (filter: Omit<Filter, 'id'>) => void;
    initialFilter?: Filter;
}

const PRESET_COLORS = [
    { value: 'default', text: '', bg: '', label: 'Default' },
    { value: 'white-black', text: '#ffffff', bg: '#000000', label: 'White on Black' },
    { value: 'black-yellow', text: '#000000', bg: '#ffff00', label: 'Black on Yellow' },
    { value: 'white-red', text: '#ffffff', bg: '#dc2626', label: 'White on Red' },
    { value: 'white-green', text: '#ffffff', bg: '#16a34a', label: 'White on Green' },
    { value: 'white-blue', text: '#ffffff', bg: '#2563eb', label: 'White on Blue' },
    { value: 'orange-black', text: '#f97316', bg: '#000000', label: 'Orange on Black' },
    { value: 'cyan-black', text: '#22d3ee', bg: '#000000', label: 'Cyan on Black' },
    { value: 'purple-black', text: '#a855f7', bg: '#000000', label: 'Purple on Black' },
];

const COLOR_OPTIONS = [
    { value: '', label: 'Default' },
    { value: '#000000', label: 'Black' },
    { value: '#ffffff', label: 'White' },
    { value: '#gray-300', label: 'Light Gray' },
    { value: '#9ca3af', label: 'Gray' },
    { value: '#4b5563', label: 'Dark Gray' },
    { value: '#dc2626', label: 'Red' },
    { value: '#ef4444', label: 'Light Red' },
    { value: '#991b1b', label: 'Dark Red' },
    { value: '#16a34a', label: 'Green' },
    { value: '#22c55e', label: 'Light Green' },
    { value: '#15803d', label: 'Dark Green' },
    { value: '#2563eb', label: 'Blue' },
    { value: '#3b82f6', label: 'Light Blue' },
    { value: '#1e40af', label: 'Dark Blue' },
    { value: '#ffff00', label: 'Yellow' },
    { value: '#fbbf24', label: 'Amber' },
    { value: '#f59e0b', label: 'Gold' },
    { value: '#f97316', label: 'Orange' },
    { value: '#fb923c', label: 'Light Orange' },
    { value: '#ea580c', label: 'Dark Orange' },
    { value: '#22d3ee', label: 'Cyan' },
    { value: '#06b6d4', label: 'Teal' },
    { value: '#0891b2', label: 'Dark Cyan' },
    { value: '#a855f7', label: 'Purple' },
    { value: '#c084fc', label: 'Light Purple' },
    { value: '#7c3aed', label: 'Dark Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#f472b6', label: 'Light Pink' },
    { value: '#be185d', label: 'Dark Pink' },
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#06b6d4', label: 'Sky Blue' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#84cc16', label: 'Lime' },
    { value: '#eab308', label: 'Yellow Gold' },
];

const FILTER_TYPE_OPTIONS = [
    { value: 'highlight', label: 'Matches text' },
    { value: 'include', label: 'Includes text' },
    { value: 'exclude', label: 'Excludes text' },
];

export function FilterModal({ isOpen, onClose, onSave, initialFilter }: FilterModalProps) {
    const [filterText, setFilterText] = useState('');
    const [textColor, setTextColor] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('highlight');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [isRegex, setIsRegex] = useState(false);
    const [preset, setPreset] = useState('default');

    useEffect(() => {
        if (initialFilter) {
            setFilterText(initialFilter.text);
            setTextColor(initialFilter.textColor);
            setBackgroundColor(initialFilter.backgroundColor);
            setFilterType(initialFilter.type);
            setCaseSensitive(initialFilter.caseSensitive);
            setIsRegex(initialFilter.isRegex);
            setPreset('default');
        } else {
            // Reset form
            setFilterText('');
            setTextColor('');
            setBackgroundColor('');
            setFilterType('highlight');
            setCaseSensitive(false);
            setIsRegex(false);
            setPreset('default');
        }
    }, [initialFilter, isOpen]);

    const handlePresetChange = (value: string) => {
        setPreset(value);
        const selectedPreset = PRESET_COLORS.find(p => p.value === value);
        if (selectedPreset) {
            setTextColor(selectedPreset.text);
            setBackgroundColor(selectedPreset.bg);
        }
    };

    const handleSave = () => {
        if (!filterText.trim()) return;

        onSave({
            text: filterText,
            textColor,
            backgroundColor,
            type: filterType,
            caseSensitive,
            isRegex,
            enabled: true,
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {initialFilter ? 'Edit Filter' : 'Add Filter'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-4">
                    {/* Filter Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Filter Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as FilterType)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                        >
                            {FILTER_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pattern */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pattern
                        </label>
                        <input
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Enter text or regex..."
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={caseSensitive}
                                onChange={(e) => setCaseSensitive(e.target.checked)}
                                className="w-4 h-4 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Case sensitive</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isRegex}
                                onChange={(e) => setIsRegex(e.target.checked)}
                                className="w-4 h-4 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Regular expression</span>
                        </label>
                    </div>

                    {/* Preset */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preset
                        </label>
                        <select
                            value={preset}
                            onChange={(e) => handlePresetChange(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                        >
                            {PRESET_COLORS.map((presetOption) => (
                                <option key={presetOption.value} value={presetOption.value}>
                                    {presetOption.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Text Color
                            </label>
                            <select
                                value={textColor}
                                onChange={(e) => {
                                    setTextColor(e.target.value);
                                    setPreset('default');
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                            >
                                {COLOR_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Background
                            </label>
                            <select
                                value={backgroundColor}
                                onChange={(e) => {
                                    setBackgroundColor(e.target.value);
                                    setPreset('default');
                                }}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                            >
                                {COLOR_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Preview
                        </label>
                        <div
                            className="px-4 py-3 rounded font-mono text-sm border border-gray-300 dark:border-gray-600"
                            style={{
                                color: textColor || undefined,
                                backgroundColor: backgroundColor || undefined,
                            }}
                        >
                            {filterText || 'Sample Text'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!filterText.trim()}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {initialFilter ? 'Update' : 'Add Filter'}
                    </button>
                </div>
            </div>
        </div>
    );
}

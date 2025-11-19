import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Filter, FilterType } from '../types';
import { cn } from '../lib/utils';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (filter: Omit<Filter, 'id'>) => void;
    initialFilter?: Filter;
}

const PRESET_COLORS = [
    { text: '#ffffff', bg: '#000000', label: 'White on Black' },
    { text: '#000000', bg: '#ffff00', label: 'Black on Yellow' },
    { text: '#ffffff', bg: '#dc2626', label: 'White on Red' },
    { text: '#ffffff', bg: '#16a34a', label: 'White on Green' },
    { text: '#ffffff', bg: '#2563eb', label: 'White on Blue' },
    { text: '#f97316', bg: '#000000', label: 'Orange on Black' },
    { text: '#22d3ee', bg: '#000000', label: 'Cyan on Black' },
    { text: '#a855f7', bg: '#000000', label: 'Purple on Black' },
];

export function FilterModal({ isOpen, onClose, onSave, initialFilter }: FilterModalProps) {
    const [filterText, setFilterText] = useState('');
    const [textColor, setTextColor] = useState('#ffffff');
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [filterType, setFilterType] = useState<FilterType>('highlight');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [isRegex, setIsRegex] = useState(false);

    useEffect(() => {
        if (initialFilter) {
            setFilterText(initialFilter.text);
            setTextColor(initialFilter.textColor);
            setBackgroundColor(initialFilter.backgroundColor);
            setFilterType(initialFilter.type);
            setCaseSensitive(initialFilter.caseSensitive);
            setIsRegex(initialFilter.isRegex);
        } else {
            // Reset form
            setFilterText('');
            setTextColor('#ffffff');
            setBackgroundColor('#000000');
            setFilterType('highlight');
            setCaseSensitive(false);
            setIsRegex(false);
        }
    }, [initialFilter, isOpen]);

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
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white">
                        {initialFilter ? 'Edit Filter' : 'Add Filter'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-4">
                    {/* Filter Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Filter Text / Pattern
                        </label>
                        <input
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Enter text or regex pattern..."
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                    </div>

                    {/* Color Presets */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Color Presets
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_COLORS.map((preset, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setTextColor(preset.text);
                                        setBackgroundColor(preset.bg);
                                    }}
                                    className="px-3 py-2 rounded text-sm border border-gray-600 hover:border-gray-500 transition-colors"
                                    style={{
                                        color: preset.text,
                                        backgroundColor: preset.bg,
                                    }}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Text Color
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Background Color
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preview
                        </label>
                        <div
                            className="px-4 py-3 rounded font-mono text-sm border"
                            style={{
                                color: textColor,
                                backgroundColor: backgroundColor,
                                borderColor: textColor,
                            }}
                        >
                            {filterText || 'Preview text will appear here'}
                        </div>
                    </div>

                    {/* Filter Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Filter Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['highlight', 'include', 'exclude'] as FilterType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={cn(
                                        'px-3 py-2 rounded text-sm capitalize transition-colors border',
                                        filterType === type
                                            ? 'bg-blue-600 text-white border-blue-500'
                                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            {filterType === 'highlight' && 'Highlight matching lines without filtering'}
                            {filterType === 'include' && 'Show only lines that match this filter'}
                            {filterType === 'exclude' && 'Hide lines that match this filter'}
                        </p>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={caseSensitive}
                                onChange={(e) => setCaseSensitive(e.target.checked)}
                                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span className="text-sm text-gray-300">Case-sensitive</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isRegex}
                                onChange={(e) => setIsRegex(e.target.checked)}
                                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span className="text-sm text-gray-300">Regular expression</span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
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

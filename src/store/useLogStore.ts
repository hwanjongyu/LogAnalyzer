import { create } from 'zustand';
import { Filter, FilterTab, LogLine } from '../types';

interface LogStore {
    // State
    rawLogLines: string[];
    processedLines: LogLine[];
    tabs: FilterTab[];
    activeTabId: string;
    filePath: string | null;
    theme: 'dark' | 'light';

    // Actions
    loadFile: (content: string, path: string) => void;
    addFilter: (filter: Omit<Filter, 'id'>) => void;
    updateFilter: (id: string, updates: Partial<Filter>) => void;
    removeFilter: (id: string) => void;
    toggleFilter: (id: string) => void;
    addTab: (name: string) => void;
    removeTab: (id: string) => void;
    setActiveTab: (id: string) => void;
    renameTab: (id: string, name: string) => void;
    saveTabToJson: (tabId: string) => string;
    loadTabFromJson: (tabId: string, json: string) => void;
    applyFilters: () => void;
    toggleTheme: () => void;
}

const GLOBAL_TAB_ID = 'global';

export const useLogStore = create<LogStore>((set, get) => ({
    // Initial state
    rawLogLines: [],
    processedLines: [],
    tabs: [
        {
            id: GLOBAL_TAB_ID,
            name: 'Global',
            filters: [],
        },
    ],
    activeTabId: GLOBAL_TAB_ID,
    filePath: null,
    theme: 'dark',

    loadFile: (content: string, path: string) => {
        const lines = content.split('\n');
        set({
            rawLogLines: lines,
            filePath: path,
        });
        get().applyFilters();
    },

    addFilter: (filter) => {
        const { tabs, activeTabId } = get();
        const newFilter: Filter = {
            ...filter,
            id: crypto.randomUUID(),
        };

        const updatedTabs = tabs.map((tab) =>
            tab.id === activeTabId
                ? { ...tab, filters: [...tab.filters, newFilter] }
                : tab
        );

        set({ tabs: updatedTabs });
        get().applyFilters();
    },

    updateFilter: (id: string, updates: Partial<Filter>) => {
        const { tabs } = get();
        const updatedTabs = tabs.map((tab) => ({
            ...tab,
            filters: tab.filters.map((filter) =>
                filter.id === id ? { ...filter, ...updates } : filter
            ),
        }));

        set({ tabs: updatedTabs });
        get().applyFilters();
    },

    removeFilter: (id: string) => {
        const { tabs } = get();
        const updatedTabs = tabs.map((tab) => ({
            ...tab,
            filters: tab.filters.filter((filter) => filter.id !== id),
        }));

        set({ tabs: updatedTabs });
        get().applyFilters();
    },

    toggleFilter: (id: string) => {
        const { tabs } = get();
        const updatedTabs = tabs.map((tab) => ({
            ...tab,
            filters: tab.filters.map((filter) =>
                filter.id === id ? { ...filter, enabled: !filter.enabled } : filter
            ),
        }));

        set({ tabs: updatedTabs });
        get().applyFilters();
    },

    addTab: (name: string) => {
        const { tabs } = get();
        const newTab: FilterTab = {
            id: crypto.randomUUID(),
            name,
            filters: [],
        };

        set({ tabs: [...tabs, newTab], activeTabId: newTab.id });
    },

    removeTab: (id: string) => {
        if (id === GLOBAL_TAB_ID) return; // Can't remove global tab

        const { tabs, activeTabId } = get();
        const updatedTabs = tabs.filter((tab) => tab.id !== id);

        set({
            tabs: updatedTabs,
            activeTabId: activeTabId === id ? GLOBAL_TAB_ID : activeTabId,
        });
        get().applyFilters();
    },

    setActiveTab: (id: string) => {
        set({ activeTabId: id });
        get().applyFilters();
    },

    renameTab: (id: string, name: string) => {
        if (id === GLOBAL_TAB_ID) return; // Can't rename global tab

        const { tabs } = get();
        const updatedTabs = tabs.map((tab) =>
            tab.id === id ? { ...tab, name } : tab
        );

        set({ tabs: updatedTabs });
    },

    saveTabToJson: (tabId: string) => {
        const { tabs } = get();
        const tab = tabs.find((t) => t.id === tabId);
        if (!tab) return '{}';

        return JSON.stringify(
            {
                name: tab.name,
                filters: tab.filters,
            },
            null,
            2
        );
    },

    loadTabFromJson: (tabId: string, json: string) => {
        try {
            const data = JSON.parse(json);
            const { tabs } = get();

            const updatedTabs = tabs.map((tab) =>
                tab.id === tabId
                    ? {
                        ...tab,
                        filters: data.filters.map((f: Filter) => ({
                            ...f,
                            id: crypto.randomUUID(), // Generate new IDs
                        })),
                    }
                    : tab
            );

            set({ tabs: updatedTabs });
            get().applyFilters();
        } catch (error) {
            console.error('Failed to load filters from JSON:', error);
        }
    },

    applyFilters: () => {
        const { rawLogLines, tabs, activeTabId } = get();

        // Get all enabled filters from global tab and active tab
        const globalTab = tabs.find((t) => t.id === GLOBAL_TAB_ID);
        const activeTab = tabs.find((t) => t.id === activeTabId);

        const allFilters = [
            ...(globalTab?.filters.filter((f) => f.enabled) || []),
            ...(activeTabId !== GLOBAL_TAB_ID
                ? activeTab?.filters.filter((f) => f.enabled) || []
                : []),
        ];

        // Separate filters by type
        const includeFilters = allFilters.filter((f) => f.type === 'include');
        const excludeFilters = allFilters.filter((f) => f.type === 'exclude');
        const highlightFilters = allFilters.filter((f) => f.type === 'highlight');

        const processedLines: LogLine[] = rawLogLines.map((text, index) => {
            let visible = includeFilters.length === 0; // If no include filters, show all
            let textColor: string | undefined;
            let backgroundColor: string | undefined;

            // Check include filters
            if (includeFilters.length > 0) {
                for (const filter of includeFilters) {
                    if (matchesFilter(text, filter)) {
                        visible = true;
                        textColor = filter.textColor;
                        backgroundColor = filter.backgroundColor;
                        break;
                    }
                }
            }

            // Check exclude filters (override includes)
            for (const filter of excludeFilters) {
                if (matchesFilter(text, filter)) {
                    visible = false;
                    break;
                }
            }

            // Apply highlight filters (only affects color, not visibility)
            if (visible) {
                for (const filter of highlightFilters) {
                    if (matchesFilter(text, filter)) {
                        textColor = filter.textColor;
                        backgroundColor = filter.backgroundColor;
                        break;
                    }
                }
            }

            return {
                index,
                text,
                textColor,
                backgroundColor,
                visible,
            };
        });

        set({ processedLines });
    },

    toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
    },
}));

function matchesFilter(text: string, filter: Filter): boolean {
    try {
        if (filter.isRegex) {
            const flags = filter.caseSensitive ? '' : 'i';
            const regex = new RegExp(filter.text, flags);
            return regex.test(text);
        } else {
            const searchText = filter.caseSensitive ? text : text.toLowerCase();
            const filterText = filter.caseSensitive
                ? filter.text
                : filter.text.toLowerCase();
            return searchText.includes(filterText);
        }
    } catch (error) {
        // Invalid regex
        return false;
    }
}

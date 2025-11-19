export type FilterType = 'include' | 'exclude' | 'highlight';

export interface Filter {
    id: string;
    text: string;
    textColor: string;
    backgroundColor: string;
    type: FilterType;
    caseSensitive: boolean;
    isRegex: boolean;
    enabled: boolean;
}

export interface FilterTab {
    id: string;
    name: string;
    filters: Filter[];
}

export interface LogLine {
    index: number;
    text: string;
    textColor?: string;
    backgroundColor?: string;
    visible: boolean;
}

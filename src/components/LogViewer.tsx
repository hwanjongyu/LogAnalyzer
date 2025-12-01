import { Virtuoso } from 'react-virtuoso';
import { useLogStore } from '../store/useLogStore';
import { cn } from '../lib/utils';

interface LogViewerProps {
    showOnlyHighlighted: boolean;
}

export function LogViewer({ showOnlyHighlighted }: LogViewerProps) {
    const processedLines = useLogStore((state) => state.processedLines);

    // Filter lines based on the toggle
    const visibleLines = processedLines.filter((line) => {
        if (!line.visible) return false;
        if (showOnlyHighlighted) {
            // Show only lines that have custom colors (i.e., matched a highlight filter)
            return line.textColor || line.backgroundColor;
        }
        return true;
    });

    if (processedLines.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                    <p className="text-lg">No file loaded</p>
                    <p className="text-sm mt-2">Click "Open File" to get started</p>
                </div>
            </div>
        );
    }

    const isFiltered = visibleLines.length !== processedLines.length;

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950 font-mono text-sm flex flex-col text-gray-900 dark:text-gray-100">
            {/* Filter Status Bar */}
            {isFiltered && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700/50 px-4 py-2 flex items-center gap-2 text-sm flex-shrink-0">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Showing {visibleLines.length.toLocaleString()} of {processedLines.length.toLocaleString()} lines
                    </span>
                    <span className="text-blue-600/60 dark:text-blue-400/60">
                        ({Math.round((visibleLines.length / processedLines.length) * 100)}% visible)
                    </span>
                </div>
            )}

            {/* Virtualized List */}
            <div className="flex-1 overflow-hidden">
                <Virtuoso
                    data={visibleLines}
                    itemContent={(_index, line) => (
                        <div
                            className={cn(
                                'px-4 py-0.5 flex hover:bg-gray-200/50 dark:hover:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-800/30',
                            )}
                        >
                            <span className="text-gray-400 dark:text-gray-500 w-16 flex-shrink-0 text-right mr-4 select-none">
                                {line.index + 1}
                            </span>
                            <span
                                className="flex-1 whitespace-pre block"
                                style={{
                                    color: line.textColor,
                                    backgroundColor: line.backgroundColor,
                                }}
                            >
                                {line.text}
                            </span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

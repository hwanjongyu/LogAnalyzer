import { Virtuoso } from 'react-virtuoso';
import { useLogStore } from '../store/useLogStore';
import { cn } from '../lib/utils';

export function LogViewer() {
    const processedLines = useLogStore((state) => state.processedLines);
    const visibleLines = processedLines.filter((line) => line.visible);

    if (processedLines.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
                <div className="text-center">
                    <p className="text-lg">No file loaded</p>
                    <p className="text-sm mt-2">Click "Open File" to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-950 font-mono text-sm">
            <Virtuoso
                data={visibleLines}
                itemContent={(_index, line) => (
                    <div
                        className={cn(
                            'px-4 py-0.5 flex hover:bg-gray-800/50 border-b border-gray-800/30',
                        )}
                        style={{
                            color: line.textColor,
                            backgroundColor: line.backgroundColor,
                        }}
                    >
                        <span className="text-gray-500 w-16 flex-shrink-0 text-right mr-4 select-none">
                            {line.index + 1}
                        </span>
                        <span className="flex-1 whitespace-pre">{line.text}</span>
                    </div>
                )}
            />
        </div>
    );
}

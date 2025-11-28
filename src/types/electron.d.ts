// Electron API types
export interface ElectronAPI {
    openFileDialog: () => Promise<{ content: string; path: string } | null>;
    openJsonDialog: () => Promise<{ content: string; path: string } | null>;
    saveJsonDialog: (defaultName: string) => Promise<string | null>;
    writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
    readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

import { useState } from 'react';
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarSeparator, 
  MenubarTrigger 
} from '@/components/ui/menubar';
import { DeepMergeEditor } from '@/components/DeepMergeEditor';
import { 
  FileText, 
  Settings, 
  HelpCircle, 
  Download, 
  Upload,
  Merge,
  Code,
  Zap
} from 'lucide-react';

function App() {
  const [lastMergeData, setLastMergeData] = useState<{
    sources: string[];
    result: string;
    mergeMode: string;
  } | null>(null);

  const handleMerge = (sources: string[], result: string, mergeMode: string) => {
    setLastMergeData({ sources, result, mergeMode });
  };

  const handleExportJSON = () => {
    if (!lastMergeData) return;
    
    const dataStr = JSON.stringify(JSON.parse(lastMergeData.result), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'merged-result.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Code className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Deep Merge Tool</h1>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Professional JSON Merger</span>
              </div>
            </div>
            
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem className="flex items-center gap-2">
                    <Merge className="h-4 w-4" />
                    New Merge
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import JSON
                  </MenubarItem>
                  <MenubarItem 
                    onClick={handleExportJSON} 
                    disabled={!lastMergeData}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Result
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Tools
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Format JSON
                  </MenubarItem>
                  <MenubarItem className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Validate JSON
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Preferences
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              
              <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Documentation</MenubarItem>
                  <MenubarItem>Merge Examples</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>About</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <DeepMergeEditor onMerge={handleMerge} />
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Deep Merge Tool - Professional JSON object merging utility</p>
            <div className="flex items-center gap-4">
              <span>Built with React + Monaco Editor</span>
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>ShadCN UI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
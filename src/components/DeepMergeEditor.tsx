import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Merge, Settings } from 'lucide-react';

interface DeepMergeEditorProps {
  onMerge: (sources: string[], result: string, mergeMode: string) => void;
}

export function DeepMergeEditor({ onMerge }: DeepMergeEditorProps) {
  const [source1, setSource1] = useState('{\n  "name": "John",\n  "age": 30,\n  "skills": ["JavaScript", "React"],\n  "address": {\n    "city": "New York",\n    "country": "USA"\n  }\n}');
  const [source2, setSource2] = useState('{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "skills": ["TypeScript", "Node.js"],\n  "address": {\n    "street": "123 Main St",\n    "zipCode": "10001"\n  }\n}');
  const [result, setResult] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "skills": ["JavaScript", "React", "TypeScript", "Node.js"],\n  "address": {\n    "city": "New York",\n    "country": "USA",\n    "street": "123 Main St",\n    "zipCode": "10001"\n  }\n}');
  const [mergeMode, setMergeMode] = useState('concat');
  const [errors, setErrors] = useState<string[]>([]);

  const validateJSON = (json: string, index: number): boolean => {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      setErrors(prev => [...prev.filter(e => !e.includes(`Source ${index + 1}`)), 
        `Source ${index + 1}: Invalid JSON - ${error instanceof Error ? error.message : 'Unknown error'}`]);
      return false;
    }
  };

  const validateAllSources = (): boolean => {
    setErrors([]);
    const sources = [source1, source2];
    let allValid = true;
    
    sources.forEach((source, index) => {
      if (source.trim() && !validateJSON(source, index)) {
        allValid = false;
      }
    });
    
    return allValid;
  };

  const handleMerge = () => {
    if (!validateAllSources()) return;

    const sources = [source1, source2]
      .filter(source => source.trim())
      .map(source => source.trim());

    if (sources.length === 0) {
      setErrors(['At least one source must be provided']);
      return;
    }

    try {
      const parsedSources = sources.map(source => JSON.parse(source));
      const merged = deepMerge(parsedSources, mergeMode);
      const resultString = JSON.stringify(merged, null, 2);
      setResult(resultString);
      onMerge(sources, resultString, mergeMode);
    } catch (error) {
      setErrors([`Merge failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Deep Merge Tool</h2>
          <p className="text-muted-foreground">Edit JSON objects in the source editors and merge them into the result editor.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Select value={mergeMode} onValueChange={setMergeMode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concat">Concat</SelectItem>
                <SelectItem value="override">Override</SelectItem>
                <SelectItem value="unique">Unique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleMerge} className="flex items-center gap-2">
            <Merge className="h-4 w-4" />
            Merge Objects
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Validation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-destructive">
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Source Object 1
              <Badge variant="outline" className="text-xs">Primary</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Editor
              height="400px"
              defaultLanguage="json"
              theme="vs-dark"
              value={source1}
              onChange={(value) => setSource1(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Source Object 2
              <Badge variant="outline" className="text-xs">Secondary</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Editor
              height="400px"
              defaultLanguage="json"
              theme="vs-dark"
              value={source2}
              onChange={(value) => setSource2(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5 text-purple-500" />
            Merged Result
            <Badge variant="outline" className="text-xs capitalize">{mergeMode} Mode</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Editor
            height="400px"
            defaultLanguage="json"
            theme="vs-dark"
            value={result}
            onChange={(value) => setResult(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              wordWrap: 'on',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function deepMerge(sources: any[], mode: string): any {
  if (sources.length === 0) return {};
  if (sources.length === 1) return sources[0];

  const result: any = {};
  
  for (const source of sources) {
    if (source == null || typeof source !== 'object') continue;
    
    for (const key in source) {
      if (!source.hasOwnProperty(key)) continue;
      
      const sourceValue = source[key];
      const resultValue = result[key];
      
      if (Array.isArray(sourceValue)) {
        if (Array.isArray(resultValue)) {
          switch (mode) {
            case 'concat':
              result[key] = [...resultValue, ...sourceValue];
              break;
            case 'unique':
              result[key] = [...new Set([...resultValue, ...sourceValue])];
              break;
            case 'override':
              result[key] = [...sourceValue];
              break;
            default:
              result[key] = [...resultValue, ...sourceValue];
          }
        } else {
          result[key] = [...sourceValue];
        }
      } else if (sourceValue != null && typeof sourceValue === 'object') {
        if (resultValue != null && typeof resultValue === 'object' && !Array.isArray(resultValue)) {
          // Recursively merge objects
          result[key] = deepMerge([resultValue, sourceValue], mode);
        } else {
          result[key] = deepMerge([{}, sourceValue], mode);
        }
      } else {
        // Primitive values: later sources override earlier ones
        result[key] = sourceValue;
      }
    }
  }
  
  return result;
}
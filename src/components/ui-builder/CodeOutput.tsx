"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Code Output Component
// Tabbed code preview with syntax highlighting and copy functionality
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { generateUICode, generateJavaCode, generateHYUIMLCode } from '@/lib/ui-builder/generators';
import { Copy, Check, Download, RefreshCw } from 'lucide-react';

// ─── Tab Button ───
function TabButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium transition-colors
        ${active 
          ? 'bg-surface-elevated text-foreground border-b-2 border-primary-500' 
          : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated/50'
        }
      `}
    >
      {children}
    </button>
  );
}

// ─── Code View with Simple Syntax Highlighting ───
function CodeView({ 
  code, 
  language 
}: { 
  code: string; 
  language: 'ui' | 'java' | 'hyuiml';
}) {
  // Simple syntax highlighting using regex
  const highlightedCode = useMemo(() => {
    return highlightSyntax(code, language);
  }, [code, language]);

  return (
    <pre className="p-4 overflow-auto font-mono text-sm leading-relaxed text-foreground-muted">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}

// ─── Simple Syntax Highlighter ───
function highlightSyntax(code: string, language: 'ui' | 'java' | 'hyuiml'): string {
  // Escape HTML first
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Common: Comments
  result = result.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;)/gm,
    '<span class="text-stone-500">$1</span>'
  );

  // Common: Strings
  result = result.replace(
    /("(?:[^"\\]|\\.)*")/g,
    '<span class="text-secondary-400">$1</span>'
  );

  if (language === 'java') {
    // Java keywords
    const javaKeywords = /\b(package|import|public|private|protected|class|interface|extends|implements|static|final|void|new|return|if|else|for|while|try|catch|throw|throws|this|super|null|true|false)\b/g;
    result = result.replace(javaKeywords, '<span class="text-primary-400">$1</span>');

    // Java annotations
    result = result.replace(
      /(@\w+)/g,
      '<span class="text-accent-400">$1</span>'
    );

    // Java types (capitalized words)
    result = result.replace(
      /\b([A-Z]\w*)\b(?!<\/span>)/g,
      '<span class="text-accent-300">$1</span>'
    );
  } else if (language === 'ui') {
    // .ui format keywords
    const uiKeywords = /\b(Group|Label|TimerLabel|ColorPicker|RawButton|RawField|AssetImage|TextButton|CancelButton|CheckBox|TextInput|NumberInput|BackButton)\b/g;
    result = result.replace(uiKeywords, '<span class="text-accent-400">$1</span>');

    // .ui properties
    const uiProperties = /\b(LayoutMode|Background|Anchor|Padding|Alignment|Style|Text|Placeholder|Value|Asset|Visible|FlexWeight|ScrollStyle|Fill|Width|Height|Left|Right|Top|Bottom|TextColor|FontSize|RenderBold|RenderItalic|Min|Max|Checked|Label)\b:/g;
    result = result.replace(uiProperties, '<span class="text-primary-400">$1</span>:');

    // .ui variable references
    result = result.replace(
      /(\$C)/g,
      '<span class="text-secondary-400">$1</span>'
    );

    // .ui element IDs
    result = result.replace(
      /(#\w+)/g,
      '<span class="text-accent-300">$1</span>'
    );
  } else if (language === 'hyuiml') {
    // HTML tags
    result = result.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span class="text-primary-400">$2</span>'
    );

    // HTML attributes
    result = result.replace(
      /(\s)([\w-]+)(=)/g,
      '$1<span class="text-accent-400">$2</span>$3'
    );
  }

  // Numbers
  result = result.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    '<span class="text-accent-300">$1</span>'
  );

  return result;
}

// ─── Main Code Output Component ───
export function CodeOutput() {
  const { state, setCodeTab } = useEditor();
  const [copied, setCopied] = useState(false);

  // Generate code based on current design
  const code = useMemo(() => {
    switch (state.activeCodeTab) {
      case 'ui':
        return generateUICode(state.design);
      case 'java':
        return generateJavaCode(state.design);
      case 'hyuiml':
        return generateHYUIMLCode(state.design);
      default:
        return '';
    }
  }, [state.design, state.activeCodeTab]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      ui: '.ui',
      java: '.java',
      hyuiml: '.html',
    };
    
    const extension = extensions[state.activeCodeTab] || '.txt';
    const filename = `${state.design.settings.className}${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTabLabel = (tab: 'ui' | 'java' | 'hyuiml') => {
    switch (tab) {
      case 'ui': return '.ui';
      case 'java': return 'Java';
      case 'hyuiml': return 'HYUIML';
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border-t border-l border-border">
      {/* Header with Tabs */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-border">
        <div className="flex">
          {(['ui', 'java', 'hyuiml'] as const).map((tab) => (
            <TabButton
              key={tab}
              active={state.activeCodeTab === tab}
              onClick={() => setCodeTab(tab)}
            >
              {getTabLabel(tab)}
            </TabButton>
          ))}
        </div>
        
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy {getTabLabel(state.activeCodeTab)}
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-surface-elevated transition-colors text-foreground-muted"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto bg-stone-950">
        <CodeView code={code} language={state.activeCodeTab} />
      </div>

      {/* Footer with Update hint for .ui tab */}
      {state.activeCodeTab === 'ui' && (
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-t border-border text-xs text-foreground-subtle">
          <RefreshCw className="w-3 h-3" />
          Code updates automatically as you design
        </div>
      )}
    </div>
  );
}


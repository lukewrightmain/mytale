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

  // Split into lines for processing
  const lines = result.split('\n');
  
  const highlightedLines = lines.map(line => {
    let highlighted = line;
    
    // Use placeholder tokens to prevent nested matching issues
    const placeholders: string[] = [];
    const addPlaceholder = (content: string): string => {
      const index = placeholders.length;
      placeholders.push(content);
      return `\x00${index}\x00`;
    };

    // Step 1: Extract and protect comments first
    highlighted = highlighted.replace(
      /(\/\/.*$)/g,
      (match) => addPlaceholder(`<span class="hl-comment">${match}</span>`)
    );

    // Step 2: Extract and protect strings
    highlighted = highlighted.replace(
      /("(?:[^"\\]|\\.)*")/g,
      (match) => addPlaceholder(`<span class="hl-string">${match}</span>`)
    );

    // Step 3: Highlight numbers BEFORE adding any colored spans
    // Only match numbers that are standalone (not part of identifiers)
    highlighted = highlighted.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      (match) => addPlaceholder(`<span class="hl-number">${match}</span>`)
    );

    // Step 4: Language-specific highlighting
    if (language === 'java') {
      // Java keywords
      const javaKeywords = /\b(package|import|public|private|protected|class|interface|extends|implements|static|final|void|new|return|if|else|for|while|try|catch|throw|throws|this|super|null|true|false)\b/g;
      highlighted = highlighted.replace(javaKeywords, 
        (match) => addPlaceholder(`<span class="hl-keyword">${match}</span>`)
      );

      // Java annotations
      highlighted = highlighted.replace(
        /(@\w+)/g,
        (match) => addPlaceholder(`<span class="hl-annotation">${match}</span>`)
      );
    } else if (language === 'ui') {
      // .ui format keywords
      const uiKeywords = /\b(Group|Label|TimerLabel|ColorPicker|RawButton|RawField|AssetImage|TextButton|CancelButton|CheckBox|TextInput|NumberInput|BackButton)\b/g;
      highlighted = highlighted.replace(uiKeywords, 
        (match) => addPlaceholder(`<span class="hl-type">${match}</span>`)
      );

      // .ui properties (before colon)
      highlighted = highlighted.replace(
        /\b(LayoutMode|Background|Anchor|Padding|Alignment|Style|Text|Placeholder|Value|Asset|Visible|FlexWeight|ScrollStyle|Fill|Width|Height|Left|Right|Top|Bottom|TextColor|FontSize|RenderBold|RenderItalic|Min|Max|Checked|Label):/g,
        (match, p1) => addPlaceholder(`<span class="hl-property">${p1}</span>`) + ':'
      );

      // .ui variable references
      highlighted = highlighted.replace(
        /(\$C)/g,
        (match) => addPlaceholder(`<span class="hl-variable">${match}</span>`)
      );

      // .ui element IDs (but not inside placeholders)
      highlighted = highlighted.replace(
        /(#[\w]+)/g,
        (match) => addPlaceholder(`<span class="hl-id">${match}</span>`)
      );
    } else if (language === 'hyuiml') {
      // HTML tags
      highlighted = highlighted.replace(
        /(&lt;\/?)([\w-]+)/g,
        (match, p1, p2) => p1 + addPlaceholder(`<span class="hl-tag">${p2}</span>`)
      );

      // HTML attributes
      highlighted = highlighted.replace(
        /(\s)([\w-]+)(=)/g,
        (match, p1, p2, p3) => p1 + addPlaceholder(`<span class="hl-attr">${p2}</span>`) + p3
      );
    }

    // Step 5: Replace placeholders with actual styled spans
    for (let i = 0; i < placeholders.length; i++) {
      highlighted = highlighted.replace(`\x00${i}\x00`, placeholders[i]);
    }

    // Step 6: Replace CSS classes with inline styles
    highlighted = highlighted
      .replace(/class="hl-comment"/g, 'style="color: #78716c;"')
      .replace(/class="hl-string"/g, 'style="color: #a78bfa;"')
      .replace(/class="hl-number"/g, 'style="color: #fbbf24;"')
      .replace(/class="hl-keyword"/g, 'style="color: #f59e0b;"')
      .replace(/class="hl-annotation"/g, 'style="color: #34d399;"')
      .replace(/class="hl-type"/g, 'style="color: #34d399;"')
      .replace(/class="hl-property"/g, 'style="color: #f59e0b;"')
      .replace(/class="hl-variable"/g, 'style="color: #a78bfa;"')
      .replace(/class="hl-id"/g, 'style="color: #60a5fa;"')
      .replace(/class="hl-tag"/g, 'style="color: #f59e0b;"')
      .replace(/class="hl-attr"/g, 'style="color: #34d399;"');

    return highlighted;
  });

  return highlightedLines.join('\n');
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


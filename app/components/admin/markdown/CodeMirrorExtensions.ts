/**
 * Dynamically loaded CodeMirror Extensions
 * All imports are done dynamically to prevent bundle inclusion
 */

import type { Extension } from '@codemirror/state';

export const createMarkdownExtensions = async (): Promise<Extension[]> => {
  // Dynamic imports to prevent inclusion in main bundle
  const [
    { markdown, markdownLanguage },
    { languages },
    { EditorView }
  ] = await Promise.all([
    import('@codemirror/lang-markdown'),
    import('@codemirror/language-data'),
    import('@codemirror/view')
  ]);

  return [
    markdown({ 
      base: markdownLanguage, 
      codeLanguages: languages,
      addKeymap: true
    }),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': {
        height: '100%',
        minHeight: '500px',
        fontSize: '14px',
        fontFamily: 'Menlo, Monaco, Consolas, monospace'
      },
      '.cm-scroller': { overflow: 'auto' },
      '.cm-content': { minHeight: '500px' },
      '.cm-gutters': { background: '#f8fafc', borderRight: '1px solid #e2e8f0' },
      '.cm-lineNumbers': { color: '#94a3b8' },
      '.cm-activeLineGutter': { backgroundColor: '#f1f5f9' }
    })
  ];
}; 
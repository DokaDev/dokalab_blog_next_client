import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';

export const createMarkdownExtensions = (): Extension[] => {
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
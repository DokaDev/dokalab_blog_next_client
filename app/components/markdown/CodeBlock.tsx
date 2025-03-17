import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './MarkdownRenderer.module.scss';
import CodeBlockClient from './CodeBlockClient';

interface CodeBlockProps {
  language: string;
  value: string;
  fileName?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, fileName = '' }) => {
  if (!value || value.trim() === '') {
    return <div className={styles.codeBlockWrapper}><div>Empty code block</div></div>;
  }

  const customStyle = {
    ...oneLight,
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      fontSize: '14.4px',
      background: 'none',
      padding: 0,
    },
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      fontSize: '14.4px',
      margin: 0,
      padding: '1.25rem',
      borderRadius: 0,
      background: '#f8fafc',
    }
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <CodeBlockClient value={value} fileName={fileName} language={language} />
      
      <div style={{ backgroundColor: '#f8fafc' }}>
        <SyntaxHighlighter
          style={customStyle}
          language={language}
          PreTag="div"
          codeTagProps={{ style: { fontSize: '14.4px' } }}
          showLineNumbers={true}
          lineNumberStyle={{ 
            minWidth: '2.5em', 
            paddingRight: '1em', 
            color: '#AAA',
            borderRight: '1px solid #E2E8F0',
            marginRight: '1em',
            textAlign: 'right'
          }}
          wrapLines={true}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: '#f8fafc',
            borderRadius: 0,
          }}
        >
          {value.replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock; 
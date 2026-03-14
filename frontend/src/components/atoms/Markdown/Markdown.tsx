import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/cn'

export interface MarkdownProps {
  children: string
  className?: string
}

const PROSE_STYLES = [
  'prose prose-sm max-w-none',

  // Parágrafos — espaçamento maior para separar os "tópicos"
  'prose-p:my-3 prose-p:leading-6',

  // Parágrafos que começam com negrito (padrão do AI: **Título:** texto)
  '[&_p:has(>strong:first-child)]:mt-4',

  // Headings
  'prose-headings:mt-4 prose-headings:mb-2 prose-headings:font-semibold',
  'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base',

  // Listas
  'prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5',
  'prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5',
  'prose-li:my-1',

  // Tipografia
  'prose-strong:font-bold prose-strong:text-inherit',
  'prose-em:italic prose-em:text-inherit',

  // Blockquote
  'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600',
  'prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300',

  // Code
  'prose-code:bg-gray-100 dark:prose-code:bg-gray-800',
  'prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
  'prose-code:before:content-none prose-code:after:content-none',
  'prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800',
  'prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto',

  // Links
  'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',

  // Divisor
  'prose-hr:my-4 prose-hr:border-gray-300 dark:prose-hr:border-gray-600',

  // Tabela
  'prose-table:w-full prose-table:border-collapse',
  'prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:p-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-800',
  'prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-2',

  // Imagem
  'prose-img:rounded-lg prose-img:my-4',

  // Espaçamento dos extremos
  '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
] as const

const REMARK_PLUGINS = [remarkGfm]
const REHYPE_PLUGINS = [rehypeRaw]

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn(...PROSE_STYLES, className)}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { 
    Bold, 
    Italic, 
    Heading1, 
    Heading2, 
    List, 
    ListOrdered,
    Undo,
    Redo,
    Table as TableIcon,
    Rows,
    Columns,
    Trash2
} from 'lucide-react';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
}: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-all ${
            isActive 
            ? 'bg-orange-500 text-white shadow-sm' 
            : 'bg-transparent text-gray-600 hover:bg-gray-100'
        } disabled:opacity-30`}
    >
        {children}
    </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const [, setTick] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || '内容を入力してください...',
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onTransaction: () => {
            // Force re-render to update toolbar button states (isActive)
            setTick(t => t + 1);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-stone prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl max-w-none min-h-[300px] px-5 py-4 focus:outline-none text-m3-on-surface',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full rounded-2xl border border-m3-outline-variant bg-white overflow-hidden transition-all focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-m3-outline-variant">
                <MenuButton
                    title="太字"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold size={18} />
                </MenuButton>
                <MenuButton
                    title="斜体"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic size={18} />
                </MenuButton>
                
                <div className="w-px h-6 bg-stone-200 mx-1" />

                <MenuButton
                    title="見出し1"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 size={18} />
                </MenuButton>
                <MenuButton
                    title="見出し2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 size={18} />
                </MenuButton>

                <div className="w-px h-6 bg-stone-200 mx-1" />

                <MenuButton
                    title="箇条書き"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List size={18} />
                </MenuButton>
                <MenuButton
                    title="番号付きリスト"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <ListOrdered size={18} />
                </MenuButton>

                <div className="w-px h-6 bg-stone-200 mx-1" />

                <MenuButton
                    title="表を挿入"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                >
                    <TableIcon size={18} />
                </MenuButton>
                <MenuButton
                    title="行を追加"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    disabled={!editor.isActive('table')}
                >
                    <Rows size={18} />
                </MenuButton>
                <MenuButton
                    title="列を追加"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    disabled={!editor.isActive('table')}
                >
                    <Columns size={18} />
                </MenuButton>
                <MenuButton
                    title="表を削除"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    disabled={!editor.isActive('table')}
                >
                    <Trash2 size={18} className="text-red-500" />
                </MenuButton>

                <div className="w-px h-6 bg-stone-200 mx-1" />

                <MenuButton
                    title="元に戻す"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo size={18} />
                </MenuButton>
                <MenuButton
                    title="やり直し"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo size={18} />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Inline Styles to override Tailwind CSS Reset */}
            <style dangerouslySetInnerHTML={{ __html: `
                /* Placeholder */
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                /* Base Reset */
                .ProseMirror {
                    outline: none !important;
                }
                /* Headings - Tailwindのリセットを強制上書き */
                .ProseMirror h1 {
                    font-size: 2.25rem !important; /* text-4xl相当 */
                    line-height: 2.5rem !important;
                    font-weight: 700 !important;
                    margin-top: 2rem !important;
                    margin-bottom: 1rem !important;
                    display: block !important;
                }
                .ProseMirror h2 {
                    font-size: 1.5rem !important; /* text-2xl相当 */
                    line-height: 2rem !important;
                    font-weight: 600 !important;
                    margin-top: 1.5rem !important;
                    margin-bottom: 0.75rem !important;
                    display: block !important;
                }
                /* Lists - Tailwindのリセットを強制上書き */
                .ProseMirror ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                    margin-top: 0.5rem !important;
                    margin-bottom: 0.5rem !important;
                    display: block !important;
                }
                .ProseMirror ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                    margin-top: 0.5rem !important;
                    margin-bottom: 0.5rem !important;
                    display: block !important;
                }
                .ProseMirror li {
                    display: list-item !important; /* Tailwindが非表示にするのを防ぐ */
                    margin-top: 0.25rem !important;
                    margin-bottom: 0.25rem !important;
                }
                .ProseMirror li p {
                    margin: 0 !important;
                    display: inline !important; /* リスト記号と横並びにするため */
                }
                /* Paragraphs */
                .ProseMirror p {
                    margin-bottom: 0.75rem !important;
                    line-height: 1.6 !important;
                    display: block !important;
                }
                /* Tables */
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 1.5rem 0 !important;
                    overflow: hidden;
                    border: 2px solid #ced4da;
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #ced4da;
                    padding: 8px 12px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: bold;
                    text-align: left;
                    background-color: #f8f9fa;
                }
                .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    background-color: #edf2ff;
                    pointer-events: none;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }
                .ProseMirror .tableWrapper {
                    overflow-x: auto;
                }
            ` }} />
        </div>
    );
};

export default RichTextEditor;

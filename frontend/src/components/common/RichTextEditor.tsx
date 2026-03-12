import React from 'react';
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
    Redo
} from 'lucide-react';

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
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || '内容を入力してください...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-stone max-w-none min-h-[300px] px-5 py-4 focus:outline-none font-medium text-m3-on-surface',
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

            {/* Tailwind Typography (prose) needs to be configured in tailwind.config.ts or added via CDN for this to look good */}
            <style dangerouslySetInnerHTML={{ __html: `
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    outline: none !important;
                }
            ` }} />
        </div>
    );
};

export default RichTextEditor;

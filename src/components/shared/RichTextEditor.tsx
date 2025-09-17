import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "İçerik yazın...",
  label,
  required,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote", "code-block"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const html = quillRef.current!.root.innerHTML;
        onChange(html);
      });
    }
    // Set initial value
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value, onChange, placeholder]);

  return (
    <div className="rich-text-editor">
      {label && (
        <label>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <div ref={editorRef} style={{ minHeight: 150, border: "1px solid #ccc", borderRadius: 4 }} />
    </div>
  );
};

export default RichTextEditor;
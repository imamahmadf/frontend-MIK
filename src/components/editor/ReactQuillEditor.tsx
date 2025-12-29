"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamic import untuk menghindari SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ReactQuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ReactQuillEditor({
  value,
  onChange,
  placeholder = "Masukkan isi berita...",
  className = "",
}: ReactQuillEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  return (
    <div className={`react-quill-wrapper ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white dark:bg-gray-800"
      />
      <style jsx global>{`
        .react-quill-wrapper .ql-container {
          min-height: 300px;
          font-size: 16px;
        }
        .react-quill-wrapper .ql-editor {
          min-height: 300px;
          color: rgb(17, 24, 39);
        }
        .dark .react-quill-wrapper .ql-editor {
          color: rgb(243, 244, 246);
        }
        .react-quill-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: rgb(209, 213, 219);
        }
        .dark .react-quill-wrapper .ql-toolbar {
          border-color: rgb(75, 85, 99);
          background-color: rgb(31, 41, 55);
        }
        .react-quill-wrapper .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: rgb(209, 213, 219);
        }
        .dark .react-quill-wrapper .ql-container {
          border-color: rgb(75, 85, 99);
        }
        .react-quill-wrapper .ql-stroke {
          stroke: rgb(107, 114, 128);
        }
        .dark .react-quill-wrapper .ql-stroke {
          stroke: rgb(156, 163, 175);
        }
        .react-quill-wrapper .ql-fill {
          fill: rgb(107, 114, 128);
        }
        .dark .react-quill-wrapper .ql-fill {
          fill: rgb(156, 163, 175);
        }
        .react-quill-wrapper .ql-picker-label {
          color: rgb(107, 114, 128);
        }
        .dark .react-quill-wrapper .ql-picker-label {
          color: rgb(156, 163, 175);
        }
      `}</style>
    </div>
  );
}

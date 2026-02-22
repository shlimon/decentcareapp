import "highlight.js/styles/github.css";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import TypingIndicator from "./TypingIndicator";

export default function ChatMessage({ message }) {
    const { role, content, isTyping, sources } = message;
    const isUser = role === "user";
    const isError = role === "error";

    const [showSources, setShowSources] = useState(false);

    const pages =
        sources?.length > 0
            ? [...new Set(sources.map((s) => s.page))].sort((a, b) => a - b)
            : [];

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-3xl px-3 py-2 rounded-lg shadow-sm text-sm leading-relaxed
                ${isUser
                        ? "bg-blue-600 text-white"
                        : isError
                            ? "bg-red-100 border border-red-300 text-red-700"
                            : "bg-gray-50 border border-gray-200 text-gray-800"
                    }`}
            >
                {isTyping ? (
                    <TypingIndicator />
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            p: (props) => <p className="mb-2" {...props} />,
                            ul: (props) => <ul className="pl-5 mb-2 list-disc" {...props} />,
                            ol: (props) => <ol className="pl-5 mb-2 list-decimal" {...props} />,
                            h1: (props) => <h1 className="mb-2 text-lg font-semibold" {...props} />,
                            h2: (props) => <h2 className="mb-2 text-base font-semibold" {...props} />,

                            code({ inline, className, children, ...props }) {
                                return !inline ? (
                                    <pre className="p-3 overflow-x-auto bg-gray-900 rounded-lg">
                                        <code
                                            className={`${className} text-sm text-gray-100`}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    </pre>
                                ) : (
                                    <code
                                        className="px-1 py-0.5 bg-gray-200 rounded text-xs"
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}

                {/* Sources Section */}
                {!isUser && pages.length > 0 && (
                    <div className="pt-3 mt-3 text-xs text-gray-500 border-t">
                        <button
                            onClick={() => setShowSources((prev) => !prev)}
                            className="font-medium text-blue-600"
                        >
                            {showSources ? "Hide Sources" : "View Sources"}
                        </button>

                        {showSources && (
                            <div className="mt-2">
                                <strong>Sources:</strong>{" "}
                                {pages.map((p, i) => (
                                    <span key={i}>
                                        Page {p}
                                        {i !== pages.length - 1 && ", "}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
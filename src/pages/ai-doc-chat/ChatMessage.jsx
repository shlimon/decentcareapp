import { useState } from "react";

export default function ChatMessage({ message }) {
    const isUser = message.role === "user";
    const isError = message.role === "error";
    const [showSources, setShowSources] = useState(false);

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`
                    max-w-[80%]
                    px-3 py-3
                    text-sm
                    rounded-lg
                    whitespace-pre-wrap
                    ${isUser
                        ? "bg-blue-500 text-white border-gray-400 rounded-br-none"
                        : isError
                            ? "bg-red-100 border-red-300"
                            : "bg-gray-100 border-gray-400 rounded-bl-none"
                    }
                `}
            >
                {message.isTyping ? "thinking ..." : message.content}

                {/* Sources */}
                {!isUser &&
                    message.sources &&
                    message.sources.length > 0 && (
                        <div className="mt-3">
                            <button
                                onClick={() =>
                                    setShowSources((prev) => !prev)
                                }
                                className="text-xs font-medium text-blue-600"
                            >
                                {showSources
                                    ? "Hide Sources"
                                    : "View Sources"}
                            </button>

                            {showSources && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {message.sources.map((s, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs"
                                        >
                                            Page {s.page}
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

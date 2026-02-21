export default function TypingIndicator() {
    return (
        <div className="flex items-center gap-1">
            <span className="ml-2 mr-2 text-xs text-gray-400">Thinking</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
        </div>
    );
}
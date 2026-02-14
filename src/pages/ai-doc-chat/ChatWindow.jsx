import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ChatMessage from './ChatMessage';

export default function ChatWindow({
    messages,
    setMessages,
    isStreaming,
    setIsStreaming,
}) {
    const [searchParams] = useSearchParams();
    const { id: documentId, versionId } = useParams();
    const type = searchParams.get('type');

    const [input, setInput] = useState('');
    const bottomRef = useRef(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isStreaming) return;

        const question = input;
        setInput('');

        const userId = crypto.randomUUID();
        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
            ...prev,
            { id: userId, role: 'user', content: question },
            {
                id: assistantId,
                role: 'assistant',
                content: '',
                isTyping: true,
                sources: [],
            },
        ]);

        setIsStreaming(true);
        abortControllerRef.current = new AbortController();

        const userData = JSON.parse(localStorage.getItem("user_data"));
        const staffData = userData?.staff || userData?.user;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/${type}/${documentId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        name: staffData.name,
                        phone: staffData.phone,
                        dob: staffData.dob,
                    },
                    body: JSON.stringify({
                        versionId,
                        question,
                    }),
                    signal: abortControllerRef.current.signal,
                },
            );

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let resultText = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                resultText += chunk;

                const match = resultText.match(/"answer":"([\s\S]*)/);

                if (match) {
                    const partial = match[1]
                        .replace(/\\"/g, '"')
                        .replace(/\\n/g, '\n')
                        .replace(/\\\\/g, '\\');

                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? { ...m, content: partial, isTyping: false }
                                : m,
                        ),
                    );
                }
            }

            const final = JSON.parse(resultText);

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId
                        ? {
                            ...m,
                            content: final.answer,
                            sources: final.sources || [],
                            isTyping: false,
                        }
                        : m,
                ),
            );
        } catch {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId
                        ? {
                            ...m,
                            role: 'error',
                            content:
                                'Sorry, something went wrong while processing your request.',
                            isTyping: false,
                        }
                        : m,
                ),
            );
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="flex flex-col px-3 w-full h-[90vh] bg-white">
            {/* Messages */}
            <div className="flex-1 py-6 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 b-10 mt-3">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your text here"
                    className="flex-1 px-4 py-3 text-sm bg-white border border-gray-400 rounded-xl focus:outline-none"
                />

                <button
                    onClick={handleSend}
                    disabled={isStreaming}
                    className="px-4 py-3 text-sm font-medium bg-white border border-gray-400 rounded-xl disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

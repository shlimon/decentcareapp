import NavigateButton from '@components/ui/NavigateButton';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ChatMessage from './ChatMessage';

export default function ChatWindow() {
    const [searchParams] = useSearchParams();
    const { id: documentId, versionId } = useParams();
    const type = searchParams.get('type');

    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);
    const abortControllerRef = useRef(null);

    // smooth auto-scroll like web version
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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

        try {
            const userData = JSON.parse(localStorage.getItem('user_data'));
            const staffData = userData?.staff || userData?.user;

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/${type}/${documentId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        name: staffData?.name,
                        phone: staffData?.phone,
                        dob: staffData?.dob,
                    },
                    body: JSON.stringify({ versionId, question }),
                    signal: abortControllerRef.current.signal,
                },
            );

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let raw = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                raw += decoder.decode(value, { stream: true });

                // safe streaming extraction (same as web)
                const start = raw.indexOf('{"answer":"');

                if (start !== -1) {
                    let partial = raw.slice(start + 11);

                    const end = partial.indexOf('","sources"');
                    if (end !== -1) {
                        partial = partial.slice(0, end);
                    }

                    partial = partial
                        .replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
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

            // safe final parse with fallback
            let final;
            try {
                final = JSON.parse(raw);
            } catch {
                final = { answer: '', sources: [] };
            }

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId
                        ? {
                            ...m,
                            content: (final.answer || '')
                                .replace(/^"+|"+$/g, '')
                                .replace(/\\"/g, '"'),
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
                            content: 'Something went wrong.',
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
        <div className="flex flex-col w-full h-[90vh] bg-gray-100">

            {/* Header */}
            <div className="px-3 pt-3 bg-white">
                <NavigateButton
                    navigateUrl={`/resource/${type === 'policy' ? 'policy' : 'handbook'}`}
                    title="Back to resources"
                    icon={ArrowLeft}
                    iconPosition="left"
                />
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3 px-4 py-4 bg-white border-t">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about this document..."
                    className="flex-1 px-4 py-3 border outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleSend}
                    disabled={isStreaming}
                    className="px-5 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
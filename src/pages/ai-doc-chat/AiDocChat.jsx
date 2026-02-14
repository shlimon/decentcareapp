import React, { useState } from 'react';
import { useParams } from 'react-router';
import ChatWindow from './ChatWindow';

const AiDocChat = () => {
    const { id, versionId } = useParams();

    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);

    return (
        <div className="flex flex-col bg-gray-100">
            <ChatWindow
                documentId={id}
                versionId={versionId}
                messages={messages}
                setMessages={setMessages}
                isStreaming={isStreaming}
                setIsStreaming={setIsStreaming}
            />
        </div>
    );
}

export default AiDocChat



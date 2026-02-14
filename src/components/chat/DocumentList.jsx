import React from 'react';
import DocumentCard from './DocumentCard';

function DocumentList({ documents, type }) {
    if (documents.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 text-gray-500">
                <p className="text-lg">No {type === "policy" ? "policies" : "handbooks"} found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
            ))}
        </div>
    );
}

export default React.memo(DocumentList);
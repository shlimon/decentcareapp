import Loading from '@components/reusable/loading/Loading';
import useGetAllDocuments from '@hooks/chat/getAllDocuments';
import React, { useMemo, useState } from 'react';
import DocumentList from './DocumentList';

function DocumentPage({
    title,
    type,
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const endpoint = type === "policy" ? "policy" : "handbook"

    const { data: documents = [], isLoading } = useGetAllDocuments({ type, endpoint });


    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) =>
            doc?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [documents, searchTerm]);

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder={`Search ${title}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 !rounded-xl focus:outline-none focus:ring-0"
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <Loading />
            ) : (
                <DocumentList type={type} documents={filteredDocuments} />
            )}
        </div>
    );
}

export default React.memo(DocumentPage);

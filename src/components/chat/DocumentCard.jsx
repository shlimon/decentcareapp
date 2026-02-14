
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import { PDFViewer } from '@components/reusable/PDFViewer';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DocumentCard({ document }) {
    const navigate = useNavigate();
    const [saveModalOpen, setSaveModalOpen] = useState(false);

    const handleRead = () => {
        setSaveModalOpen(true);
    };

    const handleChat = () => {
        navigate(`/employee-handbook/${document.id}/version/${document.activeVersion.versionId}/chat`);
    };

    const handleCancelNavigation = () => {
        setSaveModalOpen(false);
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-gray-200 border border-gray-400 rounded-2xl">

                {/* Left Content */}
                <div>
                    <p className="text-base font-semibold">
                        {document.name}
                    </p>
                    {document.activeVersion && (
                        <p className="mt-1 text-sm text-blue-500">
                            v{document.activeVersion.versionNumber}
                        </p>
                    )}
                </div>

                {/* Right Buttons */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleRead}
                        className="px-4 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg"
                    >
                        Read
                    </button>

                    <button
                        onClick={handleChat}
                        className="px-4 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg"
                    >
                        Chat
                    </button>
                </div>

            </div>


            <ModalWithContent
                title={document.name}
                content={
                    <div className="flex flex-col h-full mt-4">
                        {/* PDF Viewer Placeholder */}
                        <div className="w-full h-[650px]">
                            <PDFViewer pdfUrl={document.activeVersion.url} mode="viewer" />
                        </div>
                    </div>
                }
                isOpen={saveModalOpen}
                setIsOpen={handleCancelNavigation}
            />
        </>
    );
}

export default React.memo(DocumentCard);

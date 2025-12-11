import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import { useAuth } from '@context/auth';
import useGetMyWellbeingFollowupNotes from '@hooks/wellbeings/useGetMyWellbeingFollowupNotes';
import React, { useState } from 'react';

function WellbeingFollowupList() {
    const [showModal, setShowModal] = useState(false)
    const [followupNote, setFollowupNote] = useState({})
    const { userData } = useAuth();
    const user = userData?.user;

    const { data, isLoading, isError } = useGetMyWellbeingFollowupNotes(
        user?._id
    );

    // click
    const handleClick = (item) => {
        setShowModal(true)
        setFollowupNote(item)
    };

    return (
        <>
            <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 h-full space-y-4">
                <p className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
                    My current wellbeing follow-up notes
                </p>

                {isLoading && <p className="text-gray-500">Loading notes...</p>}

                {isError && (
                    <p className="text-red-500">Failed to load notes. Please try again.</p>
                )}

                {!isLoading && !isError && (!data || data.length === 0) && (
                    <p className="text-gray-500 italic">No follow-up notes available.</p>
                )}

                <div className="space-y-3">
                    {!isLoading &&
                        !isError &&
                        data?.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleClick(item)}
                                className="border bg-gray-50 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                            >
                                <p className="font-semibold text-gray-800">
                                    {item.title || 'Untitled'}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    {item.note || 'No notes available'}
                                </p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal */}
            <ModalWithContent
                title={followupNote.title}
                content={<></>}
                isOpen={showModal}
                setIsOpen={setShowModal}
                maxWidth="max-w-md"
            />
        </>
    );
}

export default WellbeingFollowupList;

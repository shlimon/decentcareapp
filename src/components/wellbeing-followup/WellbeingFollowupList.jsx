import { Textarea } from '@components/reusable/FormInputs';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import { useAuth } from '@context/auth';
import useGetMyWellbeingFollowupNotes from '@hooks/wellbeings/useGetMyWellbeingFollowupNotes';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

function WellbeingFollowupList() {
    const [showModal, setShowModal] = useState(false);
    const [followupNote, setFollowupNote] = useState(null);

    const { userData } = useAuth();
    const user = userData?.user;

    const { data, isLoading, isError } = useGetMyWellbeingFollowupNotes(
        user?._id
    );

    // init hook form
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            note: "",
        },
    });

    // when clicked open modal and load data
    const handleClick = (item) => {
        setFollowupNote(item);
        setShowModal(true);
        reset({ note: item.note || "" });
    };

    // handle submit form
    const onSubmit = (formData) => {
        const payload = {
            _id: followupNote._id,
            note: formData.note,
        };

        console.log("Send this into mutation:", payload);

        // mutation(payload)
        // onSuccess → setShowModal(false)
    };

    return (
        <>
            <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 h-full space-y-4">
                <p className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4">
                    My current wellbeing follow-up notes
                </p>

                {isLoading && <p className="text-gray-500">Loading notes...</p>}

                {isError && (
                    <p className="text-red-500">
                        Failed to load notes. Please try again.
                    </p>
                )}

                {!isLoading && !isError && (!data || data.length === 0) && (
                    <p className="text-gray-500 italic">
                        No follow-up notes available.
                    </p>
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
            {followupNote && (
                <ModalWithContent
                    title={followupNote.title || "Edit Note"}
                    isOpen={showModal}
                    setIsOpen={setShowModal}
                    maxWidth="max-w-md"
                    content={
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="note"
                                control={control}
                                rules={{
                                    required: "Note is required",
                                    minLength: {
                                        value: 3,
                                        message: "Note must be at least 3 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        label="Enter your note"
                                        placeholder="Enter your updated note"
                                        error={errors.description?.message}
                                        required
                                    />
                                )}
                            />
                            {errors.note && (
                                <p className="text-red-500 text-sm">
                                    {errors.note.message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Save Note
                            </button>
                        </form>
                    }
                />
            )}
        </>
    );
}

export default WellbeingFollowupList;

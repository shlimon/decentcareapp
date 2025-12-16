import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetSingleAppraisal from '@hooks/performance-appraisal/useGetSingleAppraisal';
import useUpdatePerformanceAppraisalGoal from '@hooks/performance-appraisal/useUpdatePerformanceAppraisalGoal';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

function PerformanceAppraisalDetails() {
    const { id, appraisalId } = useParams();

    const { data, isLoading, isError } = useGetSingleAppraisal(
        id,
        appraisalId
    );


    const [showModal, setShowModal] = useState(false);
    const [appraisalGoal, setAppraisalGoal] = useState(null);

    const {
        mutateAsync,
        isPending: updatePending,
        isSuccess: updateSuccess,
    } = useUpdatePerformanceAppraisalGoal(id, appraisalId);

    // init hook form
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            memberComment: '',
        },
    });

    // when clicked open modal and load data
    const handleClick = (singleGoal) => {
        if (data.status !== "Completed") {
            setAppraisalGoal(singleGoal);
            setShowModal(true);
            reset({ memberComment: singleGoal.memberComment || '' });
        }
    };


    // handle submit form
    const onSubmit = (formData) => {
        const payload = {
            goalId: appraisalGoal._id,
            memberComment: formData.memberComment,
        };

        mutateAsync({
            staffId: id,
            payload,
        });
    };

    useEffect(() => {
        if (updateSuccess) {
            setShowModal(false);
            reset();
        }
    }, [updateSuccess, reset]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-red-600">Error loading data</div>
            </div>
        );
    }
    return (
        <>
            <div className="w-full max-w-[900px] mx-auto font-montserrat p-6 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            Previous Meetings Performance Appraisal
                        </h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {data?.previousGoal &&
                            data?.previousGoal.length > 0 ? (
                            data?.previousGoal.map((singleGoal) => (
                                <div
                                    key={singleGoal._id}
                                    onClick={() => handleClick(singleGoal)}
                                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-gray-800 text-lg">
                                            {singleGoal.goalName || 'N/A'}
                                        </p>
                                    </div>
                                    {singleGoal.memberComment && (
                                        <p className="text-gray-600 text-sm mt-2 pl-2 border-l-2 border-blue-400">
                                            {singleGoal.memberComment}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                No previous meetings follow-up questions available.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {appraisalGoal && (
                <ModalWithContent
                    title={appraisalGoal.goalName || 'Edit Note'}
                    isOpen={showModal}
                    setIsOpen={setShowModal}
                    maxWidth="max-w-md"
                    content={
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter your comment{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="memberComment"
                                    control={control}
                                    rules={{
                                        required: 'Comment is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Comment must be at least 3 characters',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            placeholder="Enter your updated comment"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.memberComment
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                }`}
                                            rows={5}
                                        />
                                    )}
                                />
                                {errors.memberComment && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.memberComment.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={updatePending}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                            >
                                {updatePending ? 'Saving Comment...' : 'Save Comment'}
                            </button>
                        </form>
                    }
                />
            )}
        </>
    )
}

export default PerformanceAppraisalDetails
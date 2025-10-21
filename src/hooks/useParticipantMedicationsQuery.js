import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const useParticipantMedicationsQuery = (participantId) => {
    return useQuery({
        queryKey: ['participant-medications', participantId],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get(
                    `/medication-administrations/participant/${participantId}`
                );

                const result = response?.data;
                console.log('Participant Medications Fetch Result:', response);

                // Handle empty data array (no active medications)
                if (Array.isArray(result.data) && result.data.length === 0) {
                    return {
                        participantName: null,
                        participantCommunity: null,
                        dosesDueToday: 0,
                        administeredToday: 0,
                        todayMedications: [],
                    };
                }

                // Transform API response to component format
                return {
                    participantName: result.data.participant.name,
                    participantCommunity: result.data.participant.community,
                    dosesDueToday: result.data.summary.dueDoses,
                    administeredToday: result.data.summary.administered,
                    todayMedications: result.data.medications.map((med) => ({
                        uid: med.uid,
                        medicationName: med.name,
                        dosage: med.strength,
                        route: med.route,
                        prn: med.type === 'prn',
                        status: med.status,
                        time: med.scheduledTime || 'As Required',
                        note: med.note,
                        actionTakenBy: med.actionTakenBy,
                    })),
                };
            } catch (error) {
                console.log(error);
                toast.error('Error fetching medication data: ' + (error.message || 'Unknown error'));
                return null;
            }
        },
        enabled: !!participantId,
        staleTime: 5 * 60 * 1000,
    });
};

export default useParticipantMedicationsQuery;
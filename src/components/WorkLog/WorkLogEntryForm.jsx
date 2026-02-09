import Loading from '@components/reusable/loading/Loading';
import useGetSinglePayTemplate from '@hooks/work-log/useGetSinglePayTemplate';

const WorkLogEntryForm = ({ date, payroll }) => {
  const { data: rates, isLoading } = useGetSinglePayTemplate({
    id: payroll?.templateId,
  });

  console.log({ payroll, date, rates });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <p className="text-sm text-gray-500">
        Work log for: <strong>{date?.toLocaleDateString('en-GB')}</strong>
      </p>

      {/* rest of your form */}
    </div>
  );
};

export default WorkLogEntryForm;

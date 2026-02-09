const WorkLogEntryForm = ({ date }) => {
  // date is a JS Date object
  console.log(date);

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

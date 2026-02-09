import WorkLog from '@components/WorkLog/WorkLog';
import React from 'react';

const WorkLogPage = () => {
  return (
    <div className="max-w-xl mx-auto">
      <WorkLog />
    </div>
  );
};

export default React.memo(WorkLogPage);

import React from 'react';

const Loading = ({ loadingText = 'Loading...' }) => {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
      {loadingText && <p className="mt-2 text-gray-600">{loadingText}</p>}
    </div>
  );
};

export default React.memo(Loading);

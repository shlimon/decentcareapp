import React from 'react';

const Loading = ({ loadingText = 'Loading...' }) => {
  return (
    <div className="flex flex-col py-20">
      <div className="flex flex-col items-center justify-center flex-auto p-4 md:p-5">
        <div className="flex flex-col items-center space-y-4">
          <div
            className="animate-spin inline-block size-40 border-[3px] border-current border-t-transparent text-primary dark:text-primary_light rounded-full"
          >
            <span className="sr-only">{loadingText}</span>
          </div>
          <p className="text-lg font-medium text-primary dark:text-primary_light">
            {loadingText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Loading);

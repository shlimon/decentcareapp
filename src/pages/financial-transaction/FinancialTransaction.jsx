import FinancialTransactionForms from '@components/financial-transaction/FinancialTransactionForms';
import React, { memo } from 'react';

const FinancialTransaction = () => {
   return (
      <div>
         <FinancialTransactionForms />
      </div>
   );
};

export default memo(FinancialTransaction);

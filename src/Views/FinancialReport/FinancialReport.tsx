import React from 'react';
import { STRINGS } from '../../Shared/Strings';

function FinancialReport() {
  return (
    <div className="sm:ml-48 pt-4 px-4">
      <p className="text-4xl font-semibold">{STRINGS.FinancialReport}</p>
    </div>
  );
}

export default React.memo(FinancialReport);

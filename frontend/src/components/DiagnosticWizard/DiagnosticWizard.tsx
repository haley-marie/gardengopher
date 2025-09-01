'use client'

import NavButtons from "./NavButtons";
import ProgressIndicator from "./ProgressIndicator";
import WizardStepContent from "./WizardStepContent";

const DiagnosticWizard: React.FC = () => {
	return (
		<div className="max-w-4xl mx-auto p-6">
			{ProgressIndicator()}

			<div className="bg-white rounded-lg shadow-sm border p-6 min-h-96">
				{WizardStepContent()}
			</div>

			{NavButtons()}
		</div>
	);
};

export default DiagnosticWizard;

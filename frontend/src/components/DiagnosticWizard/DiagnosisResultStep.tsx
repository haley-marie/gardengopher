'use client'
import { DiagnosisResultProps } from "@/types/types"
import ResultTreatmentUI from "./ResultTreatmentUI";

const DiagnosisResultStep: React.FC<DiagnosisResultProps> = ({
	results,
	loading,
	error,
	selectedPlant,
	selectedSymptoms
}) => {
	if (loading) {
		return LoadingUI('Analyzing symptoms...');
	}

	if (error) {
		return ErrorUI('Diagnosis failed');
	}

	if (!results || results.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="text-gray-500">
					<h3 className="text-lg font-medium mb-2">No diagnosis found</h3>
					<p>We couldn't identify a specific deficiency based on the selected symptoms.</p>
					<p className="mt-2">Try selecting different symptoms or consult a gardening expert.</p>
				</div>
			</div>
		);
	}

	return ResultTreatmentUI(selectedPlant, selectedSymptoms, results);
};

export default DiagnosisResultStep;

import { SymptomSelectorProps } from "@/types/types";
import SymptomSelectButton from "./SymptomSelectButton";

const SymptomSelectionStep: React.FC<SymptomSelectorProps> = ({
	symptoms,
	selectedSymptoms,
	onSymptomToggle,
	selectedPlant,
	loading,
	error
}) => {
	if (loading) {
		return LoadingUI('Loading symptoms...');
	}

	if (error) {
		return ErrorUI(error)
	}

	return (
		<div className="space-y-4">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					Select Symptoms
				</h2>
				<p className="text-gray-600">
					What symptoms are you observing on your{' '}
					<span className="font-semibold capitalize">
						{selectedPlant?.name?.replace('_', ' ') ?? ''}
					</span>?
				</p>
				<div className="mt-2 text-sm text-green-600">
					Selected: {selectedSymptoms.size} symptom{selectedSymptoms.size !== 1 ? 's' : ''}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{symptoms.map((symptom) => SymptomSelectButton(symptom, selectedSymptoms, onSymptomToggle))};
			</div>
		</div>
	);
};

export default SymptomSelectionStep;

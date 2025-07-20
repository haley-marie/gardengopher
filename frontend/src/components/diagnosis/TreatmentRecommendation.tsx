import React from "react";
import { Lightbulb, CheckSquare, AlertCircle } from "lucide-react";

interface DiagnosisData {
	deficiency: string;
	name: string;
	description: string;
	treatment: string;
	confidence: number;
}

interface TreatmentRecommendationProps {
	diagnosis: DiagnosisData
}

const TreatmentRecommendation: React.FC<TreatmentRecommendationProps> = ({
	diagnosis
}) => {
	// split treatment text into actionable steps on common separators
	const treatmentSteps = diagnosis.treatment
		.split(/[,;]/)
		.map(step => step.trim())
		.filter(step => step.length > 0;

	const hasMultipleSteps = treatmentSteps.length > 1;

	return (
		<div className="space-y-4">
			<div className="bg-green-50 border border-green-200 rounded-lg p-6">
				<div className="flex items-start">
					<Lightbulb className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-green-900 mb-3">
							Recommended Treatment
						</h3>

						{hasMultipleSteps ? (
							<div className="space-y-3">
								{treatmentSteps.map((step, index) => (
									<div key={index} className="flex items-start">
										<CheckSquare className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
										<span className="text-green-800 leading-relaxed">{step}</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-green-800 leading-relaxed">{diagnosis.treatment}</p>
						)}
					</div>
				</div>
			</div>

			<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
				<div className="flex items-start">
					<AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
					<div className="text-amber-800 text-sm">
						<strong>Important:</strong> Always test treatments on a small area first. Monitor your plant's response and adjust care as needed. If symptoms persist or worsen, consider consulting with a local gardening expert or extension service.
					</div>
				</div>
			</div>

			{diagnosis.confidence < 0.7 && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="text-blue-800 text-sm">
						<strong>Additional Steps:</strong> Since this diagnosis has moderate confidence,
						consider taking photos of your plant and consulting with gardening communities online or your local agricultual extension office for a second opinion.
					</div>
				</div>
			)}
		</div>
	);
};

export default TreatmentRecommendation;

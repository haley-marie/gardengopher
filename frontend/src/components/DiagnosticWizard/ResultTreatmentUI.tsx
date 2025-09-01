'use client'

import { DiagnosisResult, Plant } from "@/types/types";

const ResultTreatmentUI = (selectedPlant: Plant, selectedSymptoms: string[], results: DiagnosisResult[]) => {
	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-semibold text-gray-800 mb-2">
					Diagnosis Results
				</h2>
				<p className="text-gray-600">
					Based on your{' '}
					<span className="font-semibold capitalize">
						{selectedPlant?.name?.replace('_', ' ') ?? ''}
					</span>{' '}
					and the {selectedSymptoms.length} selected symptom{selectedSymptoms.length !== 1 ? 's' : ''}
				</p>
			</div>

			<div className="space-y-4">
				{results.map((result, index) => (
					<div
						key={`${result.deficiency_id ?? ''}-${index}`}
						className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
					>
						{/* Confidence indicator */}
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold text-gray-800 capitalize">
								{result.deficiency_name.replace('_', ' ') ?? ''}
							</h3>
							<div className="flex items-center">
								<div className="text-sm text-gray-600 mr-2">Confidence:</div>
								<div className={`
                  								px-3 py-1 rounded-full text-sm font-medium
											${result.confidence >= 0.8
										? 'bg-green-100 text-green-800'
										: result.confidence >= 0.6
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-red-100 text-red-800'
									}`}>
									{Math.round(result.confidence * 100)}%
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="mb-4">
							<h4 className="font-medium text-gray-700 mb-2">Description:</h4>
							<p className="text-gray-600">{result.description ?? ''}</p>
						</div>

						{/* Matched symptoms */}
						{result.matched_symptoms && result.matched_symptoms.length > 0 && (
							<div className="mb-4">
								<h4 className="font-medium text-gray-700 mb-2">Matched Symptoms:</h4>
								<div className="flex flex-wrap gap-2">
									{result.matched_symptoms.map((symptom) => (
										<span
											key={symptom}
											className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
										>
											{symptom.replace(/_/g, ' ')}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Treatment */}
						<div className="bg-green-50 border border-green-200 rounded-md p-4">
							<h4 className="font-medium text-green-800 mb-2">Recommended Treatment:</h4>
							<p className="text-green-700">{result.treatment ?? ''}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ResultTreatmentUI;

import React from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface DiagnosisData {
	deficiency: string;
	name: string;
	description: string;
	treatment: string;
	confidence: number;
	matchedSymptoms?: string[];
}

interface DiagnosisResultProps {
	diagnosis: DiagnosisData;
	loading?: boolean;
	error?: string | null;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
	diagnosis,
	loading = false,
	error = null
}) => {
	if (loading) {
		return (
			<div className="flex flex-col items-0center justify-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
				<p className="text-gray-600">Analyzing your plant's symptoms...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-6">
				<div className="flex items-center mb-2">
					<AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
					<h3 className="text-lg font-semibold text-red-800">Diagnosis Error</h3>
				</div>
				<p className="text-red-700">{error}</p>
			</div>
		);
	}

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.8) return 'green';
		if (confidence >= 0.6) return 'yellow';
		return 'red';
	}

	const confidenceColor = getConfidenceColor(diagnosis.confidence);

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-xl font-semibold mb-4">Diagnosis Results</h2>
				<div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${confidenceColor === 'green' ? 'bg-green-100 text-green-800' :
					confidenceColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
						'bg-red-100 text-red-800'
					}`}>
					<Info className="w-4 h-4 mr-2" />
					Confidence: {Math.round(diagnosis.confidence * 100)}%
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<div className="flex items-start">
					<CheckCircle className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-blue-900 mb-2">
							{diagnosis.name}
						</h3>
						<p className="text-blue-800 mb-4 leading-relaxed">
							{diagnosis.description}
						</p>
					</div>
				</div>
			</div>

			{diagnosis.matchedSymptoms && diagnosis.matchedSymptoms.length > 0 && (
				<div className="bg-gray-50 rounded-lg p-4">
					<h4 className="font-semibold text-gray-900 mb-2">Key Symptoms Identified:</h4>
					<ul className="text-sm text-gray-700 space-y-1">
						{diagnosis.matchedSymptoms.map((symptom, index) => (
							<li key={index} className="flex items-center">
								<CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
								{symptom}
							</li>
						))}
					</ul>
				</div>
			)}

			{diagnosis.confidence < 0.6 && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="flex items-start">
						<AlertTriangle className="w-5 h-5 text-ywllow-600 mt-0.5 mr-2 flex-shrink-0" />
						<div className="text-yellow-800 text-sm">
							<strong>Low Confidence Warning:</strong> This diagnosis has low confidence. Consider consulting with a gardening expert or trying additional diagnostic methods.
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DiagnosisResult;

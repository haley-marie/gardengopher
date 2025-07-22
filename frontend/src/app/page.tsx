import React from 'react';
import DiagnosticWizard from './components/DiagnosticWizard';

function App() {
	return (
		<div className='min-h-screen bg-gray-100'>
			<header className='bg-white shadow-sm border-b'>
				<div className='max-w-4xl mx-auto px-6 py-4'>
					<h1 className='text-2xl font-bold text-gray-800'>
						🌱 Garden Assistant
					</h1>
					<p className="text-gray-600 mt-1">
						Identify plant nutrient deficiencies and diseases
					</p>
				</div>
			</header>

			<main className="py-8">
				<DiagnosticWizard />
			</main>
		</div>
	);
}

export default App;

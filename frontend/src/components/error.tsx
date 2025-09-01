const ErrorUI = (errorMsg: string) => {
	return (
		<div className="bg-red-50 border border-red-200 rounded-md p-4">
			<div className="text-red-800">
				<strong>Error:</strong> {errorMsg}
			</div>
		</div>
	);
}

export default ErrorUI;

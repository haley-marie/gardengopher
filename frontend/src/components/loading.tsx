const LoadingUI = (loadingMsg: string) => {
	return (
		<div className="flex items-center justify-center py-8">
			<div className="animate-spin rounded-full h-8 w-8 border b-2 border-green-600"></div>
			<span className="ml-3 text-gray-600">{loadingMsg}</span>
		</div>
	);
}

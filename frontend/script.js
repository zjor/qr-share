const getPreSignedUrl = async (filename) => {
	// const baseUrl = 'http://localhost:5000/api';
	const baseUrl = 'https://7q8tlppf6l.execute-api.eu-central-1.amazonaws.com/default';
	const url = `${baseUrl}/getPreSignedUploadUrl?filename=${filename}`;
	const res = await fetch(url);
	if (res.ok) {
		return await res.json();
	}
}
const getPreSignedUrl = async (filename) => {
	const url = `https://7q8tlppf6l.execute-api.eu-central-1.amazonaws.com/default/getPreSignedUploadUrl?filename=${filename}`;
	const res = await fetch(url);
	if (res.ok) {
		return await res.json();
	}
}
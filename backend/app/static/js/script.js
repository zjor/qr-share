const log = console.log;

const fileInput = document.querySelector('input[type="file"]');
const progressDiv = document.querySelector('#progress');
const downloadUrlDiv = document.querySelector('#download-url');
const qrCodeDiv = document.querySelector('#qr-code');

const uploadHandler = {
    onProgress: (progress, total) => {
        const percentage = (progress / total * 100).toFixed(2);
        log(`${percentage}%`);
        progressDiv.innerText = `Progress: ${percentage}`;
    },
    onCompleted: () => {
        log('done');
        progressDiv.innerText = 'Done';
        const url = `https://storage-abcd.s3.filebase.com/${fileInput.files[0].name}`;
        downloadUrlDiv.innerHTML = `<a href="${url}">${url}</a>`;
        new QRCode(qrCodeDiv, url);
    }
};

fileInput.addEventListener('change', (e) => {
    return new Promise(resolve => {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);

        xhr.upload.onprogress = (e) => uploadHandler.onProgress(e.loaded, e.total);

        xhr.upload.onloadend = (e) => {
            uploadHandler.onCompleted(e);
            resolve();
        }

        xhr.send(formData);
    });
});
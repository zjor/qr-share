import '../scss/styles.scss';
import './_icons';

import axios from 'axios';
import QRious from 'qrious';
import { fireEvent } from './_fireEvent';

const $input = document.getElementById('file');
const $uploader = document.getElementById('uploader');
const $title = document.getElementById('title');
const $progress = document.getElementById('progress');
const $time = document.getElementById('time');
const $filename = document.getElementById('filename');
const $filesize = document.getElementById('filesize');
const $copyButton = document.getElementById('qr-copy');

// const BASE_URL = 'https://qrshare.io';
// const BASE_URL = 'http://localhost:5000';
const BASE_URL = '';

let cancelTokenSource = null;
let shareLink = null;

function readfiles(files) {
  $input.files = files;
  fireEvent($input, 'change');
}

$uploader.ondragover = function () {
  $uploader.classList.add('hover');
  return false;
};

$uploader.ondragleave = function () {
  $uploader.classList.remove('hover');
  return false;
};

$uploader.ondragend = function () {
  $uploader.classList.remove('hover');
  return false;
};

$uploader.ondrop = function (e) {
  $uploader.classList.remove('hover');

  e.preventDefault();
  readfiles(e.dataTransfer.files);
}

$input.addEventListener('change', async event => {
  const file = event.target?.files?.[0];

  if (file) {
    $title.innerText = 'Uploading file';
    $uploader.classList.add('processing');

    let fileSize = file.size;
    let fileSizeAffix = 'bytes';

    while (fileSize > 1024 && fileSizeAffix !== 'Gb') {
      fileSize = (fileSize / 1024).toFixed(2);

      switch (fileSizeAffix) {
        case 'bytes':
          fileSizeAffix = 'Kb';
          break;
        case 'Kb':
          fileSizeAffix = 'Mb';
          break;
        case 'Mb':
          fileSizeAffix = 'Gb';
          break;
      }
    }

    $filename.innerText = file.name;
    $filesize.innerText = `${parseFloat(fileSize)} ${fileSizeAffix}`;
    $time.innerText = 'Calculates time remaining';

    try {
      const formData = new FormData();

      formData.append('file', event.target.files[0]);

      cancelTokenSource = axios.CancelToken.source();
      await axios.post(`${BASE_URL}/api/upload`, formData, {
        cancelToken: cancelTokenSource.token,
        onUploadProgress: ({ loaded, total, timeStamp, ...rest }) => {
          $progress.style.width = `${loaded / total * 100}%`;

          const totalSecondsLeft = parseInt((total - loaded) * timeStamp / loaded / 1000);
          const hoursLeft = parseInt(totalSecondsLeft / 60 / 60);
          const minutesLeft = parseInt((totalSecondsLeft / 60) - (hoursLeft * 60));
          const secondsLeft = parseInt(totalSecondsLeft - (hoursLeft * 60 * 60) - (minutesLeft * 60));
          let leftText = '';

          if (hoursLeft > 0) leftText += `${hoursLeft} ${hoursLeft > 1 ? 'hours' : 'hour'} `;
          if (minutesLeft > 0) leftText += `${minutesLeft} min `;
          if (secondsLeft > 0) leftText += `${secondsLeft} sec `;

          $time.innerHTML = leftText.length ? `${leftText} left` : 'almost done...';
        }
      });

      $title.innerText = 'Uploaded successfully';
      $uploader.classList.remove('processing');
      $uploader.classList.add('finished');

      shareLink = `https://storage-abcd.s3.filebase.com/${file.name}`;
      document.getElementById('qr-input').value = shareLink;
      document.getElementById('final-filename').innerText = file.name;
      document.getElementById('final-filesize').innerText = `${parseFloat(fileSize)} ${fileSizeAffix}`;

      new QRious({
        element: document.getElementById('qr-code'),
        value: shareLink,
        size: 240 // double size for retina
      });

    } catch (e) {
      console.error(e);

      if (e.message === 'cancel') {
        $title.innerHTML = 'Share files. Instantly.';
      } else {
        $title.innerHTML = 'Something went wrong<br />Please try again';
      }
    } finally {
      $uploader.classList.remove('processing');
      $filename.innerText = '';
      $filesize.innerText = '';
      $time.innerText = '';
      $progress.style.width = '0%';
      cancelTokenSource = null;
    }
  };
});

document.getElementById('cancel').addEventListener('click', function () {
  cancelTokenSource?.cancel('cancel');
}, false);

$copyButton.addEventListener('click', function () {
  document.getElementById('qr-input').focus();
  document.getElementById('qr-input').select();
  document.execCommand('copy');

  $copyButton.innerText = 'Link copied';
  $copyButton.classList.remove('icon-copy');
  $copyButton.classList.remove('btn-primary');
  $copyButton.classList.add('icon-check');
  $copyButton.classList.add('btn-light');

  setTimeout(() => {
    $copyButton.innerText = 'Copy link';
    $copyButton.classList.remove('icon-check');
    $copyButton.classList.remove('btn-light');
    $copyButton.classList.add('icon-copy');
    $copyButton.classList.add('btn-primary');
  }, 3000);
}, false);

document.getElementById('qr-share').addEventListener('click', function () {
  console.log(navigator.share);

  if (navigator.share && shareLink) {
    navigator.share({
      title: 'Share',
      text: 'Check out this link',
      url: shareLink
    });
  }
}, false);

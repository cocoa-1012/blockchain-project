import { pathOr } from 'ramda';

export const getFileUrl = pathOr(null, ['fields', 'file', 'url']);

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export async function getFilePreview(file) {
  if (file.type.startsWith('image')) {
    return await toBase64(file);
  }
  if (file.type.startsWith('video')) {
    return await extractFramesFromVideo(file);
  }
  return null;
}

// https://stackoverflow.com/questions/43007634/javascript-how-to-extract-frame-from-video
export async function extractFramesFromVideo(videoFile, fps = 25) {
  // TODO: @gosseti we don't actually want to ignore this error
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    // fully download it first (no buffering):

    let videoObjectUrl = URL.createObjectURL(videoFile);
    let video = document.createElement('video');

    let seekResolve;
    video.addEventListener('seeked', async function () {
      if (seekResolve) {
        seekResolve();
      }
    });

    video.src = videoObjectUrl;

    // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
    while (
      (video.duration === Infinity || isNaN(video.duration)) &&
      video.readyState < 2
    ) {
      await new Promise((r) => setTimeout(r, 1000));
      video.currentTime = 10000000 * Math.random();
    }

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let [w, h] = [video.videoWidth, video.videoHeight];
    canvas.width = w;
    canvas.height = h;

    video.currentTime = 1;
    await new Promise((r) => (seekResolve = r));

    context.drawImage(video, 0, 0, w, h);
    let base64ImageData = canvas.toDataURL();

    resolve(base64ImageData);
  });
}

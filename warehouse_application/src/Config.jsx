// const ApiBaseUrl='http://127.0.0.1:8000/api/';

const protocol = window.location.protocol

const ApiBaseUrl=`${protocol}//ctas.live/backend/api/`;
const OcrImgBaseUrl=`${protocol}//ctas.live/ocr_backend/warehouse/`;

// const ApiBaseUrl=`https://ctas.live/backend/api/`;
// const OcrImgBaseUrl=`https://ctas.live/ocr_backend/warehouse/`;

export {ApiBaseUrl,OcrImgBaseUrl};
const { hostname, pathname } = window.location;

let protocol = "https:";

if (hostname === "ctas.live") {
  protocol = "http:";
}

const ApiBaseUrl = `${protocol}//ctas.live/backend/api/`;
const OcrImgBaseUrl = `${protocol}//ctas.live/ocr_backend/warehouse/`;

// const ApiBaseUrl=`https://ctas.live/backend/api/`;
// const OcrImgBaseUrl=`https://ctas.live/ocr_backend/warehouse/`;

export { ApiBaseUrl, OcrImgBaseUrl };

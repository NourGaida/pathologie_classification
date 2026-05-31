/** 5 exemples Grad-CAM (style notebook) — fallback UI */
export const GRADCAM_SAMPLES = [
  '/gradcam/samples/sample_1.png',
  '/gradcam/samples/sample_2.png',
  '/gradcam/samples/sample_3.png',
  '/gradcam/samples/sample_4.png',
  '/gradcam/samples/sample_5.png',
]

export function pickGradcamSample(diseaseName, backendIndex) {
  if (backendIndex >= 1 && backendIndex <= 5) {
    return GRADCAM_SAMPLES[backendIndex - 1]
  }
  if (!diseaseName) return GRADCAM_SAMPLES[0]
  let hash = 0
  for (let i = 0; i < diseaseName.length; i++) {
    hash = (hash + diseaseName.charCodeAt(i)) % 5
  }
  return GRADCAM_SAMPLES[hash]
}

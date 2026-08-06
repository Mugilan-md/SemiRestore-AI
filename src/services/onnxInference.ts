/**
 * Client-side ONNX runtime browser inference module for SemiRestoreNet.
 */

import * as ort from "onnxruntime-web";

let cachedSession: ort.InferenceSession | null = null;

async function getSession(): Promise<ort.InferenceSession> {
  if (cachedSession) return cachedSession;
  cachedSession = await ort.InferenceSession.create("/model/semirestore.onnx", {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
  return cachedSession;
}

function imageToTensor(source: HTMLImageElement | HTMLCanvasElement): ort.Tensor {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    gray[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
  }
  return new ort.Tensor("float32", gray, [1, 1, height, width]);
}

function tensorToImageData(tensor: ort.Tensor): ImageData {
  const [, , height, width] = tensor.dims as number[];
  const src = tensor.data as Float32Array;
  const out = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const v = Math.min(255, Math.max(0, src[i] * 255));
    out[i * 4] = v;
    out[i * 4 + 1] = v;
    out[i * 4 + 2] = v;
    out[i * 4 + 3] = 255;
  }
  return new ImageData(out, width, height);
}

export interface RestoreResult {
  imageData: ImageData;
  inferenceMs: number;
}

export async function restoreImage(
  source: HTMLImageElement | HTMLCanvasElement
): Promise<RestoreResult> {
  const session = await getSession();
  const inputTensor = imageToTensor(source);

  const t0 = performance.now();
  const feeds: Record<string, ort.Tensor> = { degraded_image: inputTensor };
  const results = await session.run(feeds);
  const inferenceMs = performance.now() - t0;

  const outputTensor = results["restored_image"];
  return { imageData: tensorToImageData(outputTensor), inferenceMs };
}

export function drawResult(canvas: HTMLCanvasElement, result: RestoreResult) {
  canvas.width = result.imageData.width;
  canvas.height = result.imageData.height;
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(result.imageData, 0, 0);
}

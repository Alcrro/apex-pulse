import type { MutableRefObject, RefObject } from 'react'
import type { IScannerControls } from '@zxing/browser'

export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
}

export const BARCODE_FORMATS = ['ean_13', 'upc_a', 'upc_e']

export const DETECTION_COOLDOWN_MS = 1500

interface BarcodeDetectorResult { rawValue: string }

export interface BarcodeDetectorInstance {
  detect(image: HTMLVideoElement): Promise<BarcodeDetectorResult[]>
}

declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => BarcodeDetectorInstance
  }
}

export function getCameraErrorMessage(err: unknown): string {
  const name = err instanceof Error ? err.name : (err as { name?: string } | null)?.name
  return name === 'NotAllowedError'
    ? 'Permisiune cameră refuzată. Activează accesul în setările browserului.'
    : 'Nu se poate accesa camera.'
}

export function checkTorchCapability(stream: MediaStream): boolean {
  try {
    const track = stream.getVideoTracks()[0]
    if (!track) return false
    const caps = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean }
    return !!caps.torch
  } catch {
    return false
  }
}

export function runNativeBarcodeDetectorLoop(
  videoRef: RefObject<HTMLVideoElement>,
  detectorRef: MutableRefObject<BarcodeDetectorInstance | null>,
  isRunningRef: MutableRefObject<boolean>,
  onDetected: (barcode: string) => void
): void {
  const loop = async () => {
    if (!isRunningRef.current) return
    const vid = videoRef.current
    const det = detectorRef.current
    if (vid && det && vid.readyState >= 2) {
      try {
        const barcodes = await det.detect(vid)
        if (barcodes.length > 0 && barcodes[0].rawValue) {
          onDetected(barcodes[0].rawValue)
          return
        }
      } catch { /* frame decode error, continue */ }
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}

export async function startZxingReader(
  stream: MediaStream,
  video: HTMLVideoElement,
  isRunningRef: MutableRefObject<boolean>,
  onDetected: (barcode: string) => void
): Promise<IScannerControls> {
  const { BrowserMultiFormatReader } = await import('@zxing/browser')
  const reader = new BrowserMultiFormatReader()
  return reader.decodeFromStream(stream, video, (result) => {
    if (result && isRunningRef.current) onDetected(result.getText())
  })
}

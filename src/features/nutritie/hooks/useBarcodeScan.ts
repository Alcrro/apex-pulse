import { useRef, useState, useCallback, useEffect } from 'react'
import type { IScannerControls } from '@zxing/browser'
import {
  CAMERA_CONSTRAINTS,
  BARCODE_FORMATS,
  DETECTION_COOLDOWN_MS,
  getCameraErrorMessage,
  checkTorchCapability,
  runNativeBarcodeDetectorLoop,
  startZxingReader,
} from '../utils/barcodeScanner'
import type { BarcodeDetectorInstance } from '../utils/barcodeScanner'

export type BarcodeScanState = 'idle' | 'requesting' | 'scanning' | 'detected' | 'error'

export interface UseBarcodeScanResult {
  videoRef: React.RefObject<HTMLVideoElement>
  state: BarcodeScanState
  detectedBarcode: string | null
  error: string | null
  isBarcodeDetectorSupported: boolean
  startScan: () => void
  stopScan: () => void
  isTorchAvailable: boolean
  torchOn: boolean
  toggleTorch: () => void
}

interface TorchTrack {
  applyConstraints(constraints: { advanced: [{ torch: boolean }] }): Promise<void>
}

export function useBarcodeScan(): UseBarcodeScanResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null)
  const zxingControlsRef = useRef<IScannerControls | null>(null)
  const isRunningRef = useRef(false)
  const cooldownRef = useRef(false)

  const [state, setState] = useState<BarcodeScanState>('idle')
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTorchAvailable, setIsTorchAvailable] = useState(false)
  const [torchOn, setTorchOn] = useState(false)

  const isBarcodeDetectorSupported = 'BarcodeDetector' in window

  function triggerDetection(barcode: string) {
    if (cooldownRef.current) return
    cooldownRef.current = true
    setState('detected')
    setDetectedBarcode(barcode)
    if (navigator.vibrate) navigator.vibrate(100)
    setTimeout(() => {
      if (isRunningRef.current) {
        cooldownRef.current = false
        setState('scanning')
      }
    }, DETECTION_COOLDOWN_MS)
  }

  const stopScan = useCallback(() => {
    isRunningRef.current = false
    if (zxingControlsRef.current) {
      try { zxingControlsRef.current.stop() } catch { /* ignore */ }
      zxingControlsRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    cooldownRef.current = false
    setTorchOn(false)
    setState('idle')
  }, [])

  const startScan = useCallback(async () => {
    setState('requesting')
    setError(null)
    setDetectedBarcode(null)
    cooldownRef.current = false

    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS)
      streamRef.current = stream

      if (checkTorchCapability(stream)) setIsTorchAvailable(true)

      isRunningRef.current = true
      setState('scanning')

      if ('BarcodeDetector' in window) {
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
        }
        detectorRef.current = new window.BarcodeDetector!({ formats: BARCODE_FORMATS })
        runNativeBarcodeDetectorLoop(videoRef, detectorRef, isRunningRef, triggerDetection)
      } else {
        const vid = videoRef.current!
        const controls = await startZxingReader(stream, vid, isRunningRef, triggerDetection)
        zxingControlsRef.current = controls
      }
    } catch (err: unknown) {
      setState('error')
      setError(getCameraErrorMessage(err))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      await (track as unknown as TorchTrack).applyConstraints({ advanced: [{ torch: !torchOn }] })
      setTorchOn(v => !v)
    } catch { /* torch toggle not supported */ }
  }, [torchOn])

  useEffect(() => () => { stopScan() }, [stopScan])

  return {
    videoRef,
    state,
    detectedBarcode,
    error,
    isBarcodeDetectorSupported,
    startScan,
    stopScan,
    isTorchAvailable,
    torchOn,
    toggleTorch,
  }
}

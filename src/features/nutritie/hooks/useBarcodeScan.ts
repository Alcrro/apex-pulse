import { useRef, useState, useCallback, useEffect } from 'react'

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

export function useBarcodeScan(): UseBarcodeScanResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<any>(null)
  const zxingControlsRef = useRef<any>(null)
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
    }, 1500)
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream

      // Torch capability check
      try {
        const track = stream.getVideoTracks()[0]
        const caps = (track?.getCapabilities as any)?.()
        if (caps?.torch) setIsTorchAvailable(true)
      } catch { /* torch not available */ }

      isRunningRef.current = true
      setState('scanning')

      if ('BarcodeDetector' in window) {
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play()
        }
        detectorRef.current = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'upc_a', 'upc_e'],
        })
        const loop = async () => {
          if (!isRunningRef.current) return
          const vid = videoRef.current
          const det = detectorRef.current
          if (vid && det && vid.readyState >= 2) {
            try {
              const barcodes = await det.detect(vid)
              if (barcodes.length > 0 && barcodes[0].rawValue) {
                triggerDetection(barcodes[0].rawValue as string)
                // cooldown: next loop scheduled by triggerDetection timeout
                return
              }
            } catch { /* frame decode error, continue */ }
          }
          requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
      } else {
        // Lazy-load ZXing fallback for Safari
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const reader = new BrowserMultiFormatReader()
        const vid = videoRef.current
        const controls = await reader.decodeFromStream(stream, vid!, (result) => {
          if (result && isRunningRef.current) {
            triggerDetection(result.getText())
          }
        })
        zxingControlsRef.current = controls
      }
    } catch (err: any) {
      const msg =
        err?.name === 'NotAllowedError'
          ? 'Permisiune cameră refuzată. Activează accesul în setările browserului.'
          : 'Nu se poate accesa camera.'
      setState('error')
      setError(msg)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      await (track as any).applyConstraints({ advanced: [{ torch: !torchOn }] })
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

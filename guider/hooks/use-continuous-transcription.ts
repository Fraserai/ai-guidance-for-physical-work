import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

import { transcribeAudioChunk } from '@/lib/openai';

type UseContinuousTranscriptionOptions = {
  enabled: boolean;
  apiKey: string;
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
  chunkMs?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useContinuousTranscription({
  enabled,
  apiKey,
  onTranscript,
  onError,
  chunkMs = 4500
}: UseContinuousTranscriptionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const loopActiveRef = useRef(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const stopListening = useCallback(async () => {
    loopActiveRef.current = false;
    setIsListening(false);

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {
        // ignore stop errors when recording is already stopped.
      }
      recordingRef.current = null;
    }
  }, []);

  const captureChunk = useCallback(async () => {
    if (!loopActiveRef.current) {
      return;
    }

    try {
      const recording = new Audio.Recording();
      recordingRef.current = recording;

      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      await sleep(chunkMs);

      if (!loopActiveRef.current) {
        await recording.stopAndUnloadAsync();
        recordingRef.current = null;
        return;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;

      if (uri && apiKey) {
        const transcript = await transcribeAudioChunk(apiKey, uri);

        if (transcript) {
          onTranscript(transcript);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Voice transcription failed.';
      onError?.(message);
    }

    if (loopActiveRef.current) {
      void captureChunk();
    }
  }, [apiKey, chunkMs, onError, onTranscript]);

  const startListening = useCallback(async () => {
    if (!apiKey) {
      onError?.('Add your OpenAI API key in Settings to enable voice mode.');
      return;
    }

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        onError?.('Microphone permission is required for always-listening mode.');
        setPermissionGranted(false);
        return;
      }

      setPermissionGranted(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true
      });

      loopActiveRef.current = true;
      setIsListening(true);
      void captureChunk();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start microphone.';
      onError?.(message);
      await stopListening();
    }
  }, [apiKey, captureChunk, onError, stopListening]);

  useEffect(() => {
    if (enabled) {
      void startListening();
      return;
    }

    void stopListening();
  }, [enabled, startListening, stopListening]);

  useEffect(() => {
    return () => {
      void stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    permissionGranted,
    startListening,
    stopListening
  };
}

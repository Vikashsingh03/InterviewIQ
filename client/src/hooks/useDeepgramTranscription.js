import { useRef, useState, useCallback } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import axios from "axios";
import { ServerUrl } from "../App";

export function useDeepgramTranscription({ onTranscript, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const connectionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const cleanup = useCallback(() => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {
      // already stopped — safe to ignore
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    connectionRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    if (isListening) return;

    try {
      // 1. get a short-lived token from OUR server — the real Deepgram API
      // key never reaches the browser
      const { data } = await axios.get(`${ServerUrl}/api/deepgram/token`, {
        withCredentials: true,
      });

      if (!data?.accessToken) {
        throw new Error("No token returned");
      }

      // 2. ask for the mic
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;

      // 3. open the Deepgram live connection with that token
      const deepgram = createClient({ accessToken: data.accessToken });

      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "en-IN",
        smart_format: true,
        interim_results: true,
        endpointing: 300,
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          // readyState 1 === OPEN
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        };

        // send audio in small chunks for low-latency streaming
        mediaRecorder.start(250);
        setIsListening(true);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (evt) => {
        const text = evt?.channel?.alternatives?.[0]?.transcript;
        if (text && text.trim()) {
          onTranscript?.(text.trim(), !!evt.is_final);
        }
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.log("Deepgram connection error:", err);
        onError?.(
          "Voice recognition hit an error. You can keep typing your answer.",
        );
        cleanup();
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        setIsListening(false);
      });

      connectionRef.current = connection;
    } catch (err) {
      console.log(err);
      if (err?.name === "NotAllowedError") {
        onError?.(
          "Mic access was denied. Please type your answer, or enable mic permission in your browser settings.",
        );
      } else {
        onError?.(
          "Couldn't start voice recognition right now. You can type your answer instead.",
        );
      }
      cleanup();
    }
  }, [isListening, onTranscript, onError, cleanup]);

  const stop = useCallback(() => {
    connectionRef.current?.finish();
    cleanup();
  }, [cleanup]);

  return { start, stop, isListening }
}
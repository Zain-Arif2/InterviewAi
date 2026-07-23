'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const onFinalResultRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final && onFinalResultRef.current) {
        onFinalResultRef.current(final.trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      setError(event.error === 'not-allowed' ? 'Microphone access denied.' : 'Voice input error. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback((onFinalResult) => {
    if (!recognitionRef.current) return;
    setError(null);
    onFinalResultRef.current = onFinalResult;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // Ignore "already started" errors
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, interimTranscript, error, startListening, stopListening };
}
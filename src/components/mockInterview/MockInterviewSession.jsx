import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

const questionsData = [
  "Explain OOP principles in Java.",
  "What is the difference between abstraction and encapsulation?",
  "What are Python decorators?",
];

export default function MockInterviewSession() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // 🎤 Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  // 📷 Auto start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsListening(!isListening);
  };

  const nextQuestion = () => {
    setTranscript("");

    if (questionIndex + 1 === questionsData.length) {
      setInterviewCompleted(true);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setIsListening(false);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 text-white flex items-center justify-center p-6">
    {!interviewCompleted ? (
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SIDE - Question Section */}
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-cyan-300 text-sm uppercase tracking-widest mb-3">
            Question {questionIndex + 1} of {questionsData.length}
          </h2>

          <h1 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
            {questionsData[questionIndex]}
          </h1>

          <div className="bg-slate-900/60 rounded-2xl p-5 min-h-[140px] border border-purple-400/20">
            <p className="text-sm text-purple-300 mb-2 uppercase">
              Your Answer
            </p>
            <p className="text-gray-200">
              {transcript || "Start speaking..."}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6 mt-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              onClick={toggleListening}
              className={`p-6 rounded-full shadow-lg transition-all ${
                isListening
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500"
              }`}
            >
              {isListening ? <MicOff size={26} /> : <Mic size={26} />}
            </motion.button>

            {/* Voice Waves */}
            {isListening && (
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 50, 20, 60, 15] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.04,
                    }}
                    className="w-1.5 bg-gradient-to-t from-cyan-400 to-blue-600 rounded-full"
                  />
                ))}
              </div>
            )}

            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Next Question
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE - Camera */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-3xl"></div>

          <div className="relative rounded-3xl overflow-hidden border border-cyan-400/30 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-[420px] object-cover"
            />
          </div>

          <p className="text-center mt-4 text-cyan-300 text-sm tracking-wide">
            Live Interview Camera
          </p>
        </motion.div>
      </div>
    ) : (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-300 mb-4">
          Interview Completed 🎉
        </h1>
        <p className="text-gray-300">
          Camera and microphone have been turned off.
        </p>
      </div>
    )}
  </div>
);

}

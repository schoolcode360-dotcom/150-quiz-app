import React, { useState, useEffect } from 'react';
import questions from './data/questions.json';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState({}); // { questionId: 'correct' | 'incorrect' }

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('quizProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('quizProgress', JSON.stringify(progress));
  }, [progress]);

  const currentQuestion = questions[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
    setShowAnswer(false);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
    setShowAnswer(false);
  };

  const goRandom = () => {
    const rand = Math.floor(Math.random() * questions.length);
    setCurrentIndex(rand);
    setShowAnswer(false);
  };

  const markAnswer = (isCorrect) => {
    setProgress((prev) => ({
      ...prev,
      [currentQuestion.id]: isCorrect ? 'correct' : 'incorrect'
    }));
    goNext();
  };

  const answeredCount = Object.keys(progress).length;
  const correctCount = Object.values(progress).filter(v => v === 'correct').length;

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">150 Hard Problems Quiz</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Question {currentQuestion.id} of {questions.length}
        </p>
        <p className="text-sm text-gray-600 text-center mb-6">
          Progress: {answeredCount}/{questions.length} answered ({correctCount} correct)
        </p>
        <div className="mb-6">
          <p className="whitespace-pre-line">{currentQuestion.question}</p>
        </div>
        {showAnswer && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded">
            <strong>Answer:</strong> {currentQuestion.answer}
          </div>
        )}
        <div className="flex gap-3 justify-center mb-4">
          <button onClick={goPrev} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Prev</button>
          {!showAnswer && (
            <button onClick={() => setShowAnswer(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check Answer</button>
          )}
          {showAnswer && (
            <>
              <button onClick={() => markAnswer(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">I Got It Right</button>
              <button onClick={() => markAnswer(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">I Got It Wrong</button>
            </>
          )}
          <button onClick={goNext} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
        </div>
        <div className="flex justify-center">
          <button onClick={goRandom} className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500">Random Question</button>
        </div>
      </div>
    </div>
  );
}

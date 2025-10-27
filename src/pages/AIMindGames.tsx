import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Zap, MessageSquare, Pencil, Grid3x3, Mic, Timer, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Types
interface GameState {
  gameId: string;
  stage: 'intro' | 'playing' | 'completed' | 'hint';
  data: any;
  score: number;
  timeLeft?: number;
  hintsUsed: number;
}

interface WordMorphState {
  startWord: string;
  targetWord: string;
  currentWord: string;
  steps: string[];
  maxSteps: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface RiddleState {
  riddle: string;
  answer: string;
  hints: string[];
  attempts: number;
  solved: boolean;
}

interface QuickDrawState {
  wordToDraw: string;
  timer: number;
  drawing: string[];
  aiGuess: string;
  round: number;
  score: number;
}

interface LogicGridState {
  puzzle: string;
  clues: string[];
  solution: Record<string, string>;
  playerSolution: Record<string, string>;
  categories: string[];
}

interface DebateState {
  topic: string;
  debaterA: { name: string; position: string; points: string[] };
  debaterB: { name: string; position: string; points: string[] };
  userVote: string | null;
  round: number;
}

interface QuizState {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  currentQuestion: number;
  score: number;
  selectedAnswer: number | null;
}

const AIMindGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [drawing, setDrawing] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Game configurations
  const games = [
    {
      id: "word-morph" as const,
      title: "Word Morph",
      description: "Transform one word into another through logical steps",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      difficulty: ['easy', 'medium', 'hard']
    },
    {
      id: "riddle-me" as const,
      title: "RiddleMe",
      description: "Solve AI-generated riddles with progressive hints",
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "quickdraw-ai" as const,
      title: "QuickDraw AI",
      description: "Draw and let AI guess your sketches in real-time",
      icon: Pencil,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "logic-grid" as const,
      title: "Logic Grid",
      description: "Solve complex logic puzzles with multiple categories",
      icon: Grid3x3,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "ai-debate" as const,
      title: "AI Debate",
      description: "Watch AI debaters argue and vote for the most convincing",
      icon: Mic,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "quiz-rush" as const,
      title: "QuizRush",
      description: "Fast-paced quiz with instant AI scoring and explanations",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // Sound effects
  const playSound = (type: 'success' | 'error' | 'click' | 'complete') => {
    if (!audioEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'success':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'complete':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        break;
    }
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Initialize drawing canvas
  useEffect(() => {
    if (selectedGame === 'quickdraw-ai' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [selectedGame]);

  // Game initialization
  const startGame = async (gameId: string) => {
    setLoading(true);
    setUserInput("");
    setDrawing([]);
    
    try {
      let initialGameState: GameState;

      switch (gameId) {
        case 'word-morph':
          initialGameState = await initializeWordMorph();
          break;
        case 'riddle-me':
          initialGameState = await initializeRiddleMe();
          break;
        case 'quickdraw-ai':
          initialGameState = await initializeQuickDraw();
          break;
        case 'logic-grid':
          initialGameState = await initializeLogicGrid();
          break;
        case 'ai-debate':
          initialGameState = await initializeAIDebate();
          break;
        case 'quiz-rush':
          initialGameState = await initializeQuizRush();
          break;
        default:
          throw new Error('Unknown game');
      }

      setGameState(initialGameState);
      setSelectedGame(gameId);
      playSound('click');
      
      toast({
        title: "Game Started! 🎮",
        description: `Get ready to play ${games.find(g => g.id === gameId)?.title}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // WORD MORPH GAME
  const initializeWordMorph = async (): Promise<GameState> => {
    const wordPairs = [
      { start: 'COLD', target: 'WARM', difficulty: 'easy' },
      { start: 'CAT', target: 'DOG', difficulty: 'easy' },
      { start: 'LEAD', target: 'GOLD', difficulty: 'medium' },
      { start: 'WHEAT', target: 'BREAD', difficulty: 'hard' },
      { start: 'NIGHT', target: 'DAY', difficulty: 'easy' }
    ];
    
    const pair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    
    return {
      gameId: 'word-morph',
      stage: 'playing',
      score: 0,
      hintsUsed: 0,
      data: {
        startWord: pair.start,
        targetWord: pair.target,
        currentWord: pair.start,
        steps: [pair.start],
        maxSteps: 6,
        difficulty: pair.difficulty
      } as WordMorphState
    };
  };

  const handleWordMorphSubmit = () => {
    if (!gameState || !userInput.trim()) return;

    const currentData = gameState.data as WordMorphState;
    const newWord = userInput.trim().toUpperCase();

    // Validate word change (only one letter difference)
    if (newWord.length !== currentData.currentWord.length) {
      toast({
        title: "Invalid Move",
        description: "Word must be the same length",
        variant: "destructive"
      });
      playSound('error');
      return;
    }

    let differences = 0;
    for (let i = 0; i < newWord.length; i++) {
      if (newWord[i] !== currentData.currentWord[i]) differences++;
    }

    if (differences !== 1) {
      toast({
        title: "Invalid Move",
        description: "Only change one letter at a time",
        variant: "destructive"
      });
      playSound('error');
      return;
    }

    // Check if word is valid (in a real app, you'd check against a dictionary)
    const isValidWord = true; // Simplified for demo

    if (!isValidWord) {
      toast({
        title: "Invalid Word",
        description: "That's not a valid English word",
        variant: "destructive"
      });
      playSound('error');
      return;
    }

    const newSteps = [...currentData.steps, newWord];
    const isComplete = newWord === currentData.targetWord;

    setGameState(prev => prev ? {
      ...prev,
      stage: isComplete ? 'completed' : 'playing',
      score: prev.score + (isComplete ? 100 : 10),
      data: {
        ...currentData,
        currentWord: newWord,
        steps: newSteps
      }
    } : null);

    setUserInput("");
    playSound(isComplete ? 'complete' : 'success');

    if (isComplete) {
      toast({
        title: "Congratulations! 🎉",
        description: `You transformed ${currentData.startWord} to ${currentData.targetWord} in ${newSteps.length - 1} steps!`,
      });
    }
  };

  // RIDDLE ME GAME
  const initializeRiddleMe = async (): Promise<GameState> => {
    const riddles = [
      {
        riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
        answer: "AN ECHO",
        hints: [
          "You often hear me in mountains or empty halls",
          "I repeat what you say",
          "I'm a sound phenomenon"
        ]
      },
      {
        riddle: "The more you take, the more you leave behind. What am I?",
        answer: "FOOTSTEPS",
        hints: [
          "You create me when you walk",
          "I'm often found on sandy beaches",
          "Each step makes more of me"
        ]
      }
    ];

    const riddle = riddles[Math.floor(Math.random() * riddles.length)];

    return {
      gameId: 'riddle-me',
      stage: 'playing',
      score: 0,
      hintsUsed: 0,
      data: {
        riddle: riddle.riddle,
        answer: riddle.answer,
        hints: riddle.hints,
        attempts: 0,
        solved: false
      } as RiddleState
    };
  };

  const handleRiddleSubmit = () => {
    if (!gameState) return;

    const currentData = gameState.data as RiddleState;
    const userAnswer = userInput.trim().toUpperCase();
    const isCorrect = userAnswer === currentData.answer;

    if (isCorrect) {
      setGameState(prev => prev ? {
        ...prev,
        stage: 'completed',
        score: prev.score + 50 - (prev.hintsUsed * 10),
        data: {
          ...currentData,
          solved: true
        }
      } : null);
      
      playSound('complete');
      toast({
        title: "Correct! 🎉",
        description: "You solved the riddle!",
      });
    } else {
      setGameState(prev => prev ? {
        ...prev,
        data: {
          ...currentData,
          attempts: currentData.attempts + 1
        }
      } : null);
      
      playSound('error');
      toast({
        title: "Try Again",
        description: `Attempts: ${currentData.attempts + 1}`,
        variant: "destructive"
      });
    }
    setUserInput("");
  };

  const giveRiddleHint = () => {
    if (!gameState) return;

    const currentData = gameState.data as RiddleState;
    const hintIndex = gameState.hintsUsed;

    if (hintIndex < currentData.hints.length) {
      setGameState(prev => prev ? {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        stage: 'hint'
      } : null);
      
      toast({
        title: `Hint ${hintIndex + 1}`,
        description: currentData.hints[hintIndex],
      });
      playSound('click');
    }
  };

  // QUICK DRAW GAME
  const initializeQuickDraw = async (): Promise<GameState> => {
    const words = ['HOUSE', 'TREE', 'CAT', 'SUN', 'CAR', 'FISH', 'BOOK', 'APPLE'];
    const wordToDraw = words[Math.floor(Math.random() * words.length)];

    return {
      gameId: 'quickdraw-ai',
      stage: 'playing',
      score: 0,
      hintsUsed: 0,
      data: {
        wordToDraw,
        timer: 30,
        drawing: [],
        aiGuess: '',
        round: 1,
        score: 0
      } as QuickDrawState
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDrawing(prev => [...prev, `M ${x} ${y}`]);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawing(prev => {
      const newDrawing = [...prev, `L ${x} ${y}`];
      
      // Draw on canvas
      const ctx = canvas.getContext('2d');
      if (ctx && prev.length > 0) {
        const lastPoint = prev[prev.length - 1].split(' ');
        if (lastPoint[0] === 'M' || lastPoint[0] === 'L') {
          ctx.beginPath();
          ctx.moveTo(parseFloat(lastPoint[1]), parseFloat(lastPoint[2]));
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
      
      return newDrawing;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const submitDrawing = async () => {
    if (!gameState) return;

    // Simulate AI guessing (in real app, you'd send to an AI service)
    const currentData = gameState.data as QuickDrawState;
    const similarity = Math.random(); // Simulated accuracy
    
    const isCorrect = similarity > 0.6;
    const aiGuess = isCorrect ? currentData.wordToDraw : 'UNKNOWN';

    setGameState(prev => prev ? {
      ...prev,
      data: {
        ...currentData,
        aiGuess,
        score: currentData.score + (isCorrect ? 25 : 0)
      }
    } : null);

    playSound(isCorrect ? 'success' : 'error');
    
    toast({
      title: isCorrect ? "AI Guessed Correctly! 🤖" : "AI Couldn't Guess",
      description: isCorrect ? `The AI recognized your ${currentData.wordToDraw.toLowerCase()}!` : "Try drawing more clearly next round!",
    });

    // Start next round after delay
    setTimeout(() => {
      if (gameState.data.round < 3) {
        initializeQuickDraw().then(newState => {
          setGameState(prev => prev ? {
            ...prev,
            data: {
              ...newState.data,
              round: prev.data.round + 1,
              score: prev.data.score
            }
          } : null);
          setDrawing([]);
          
          // Clear canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
          }
        });
      } else {
        setGameState(prev => prev ? { ...prev, stage: 'completed' } : null);
        playSound('complete');
      }
    }, 3000);
  };

  // LOGIC GRID GAME
  const initializeLogicGrid = async (): Promise<GameState> => {
    // Simplified logic puzzle
    return {
      gameId: 'logic-grid',
      stage: 'playing',
      score: 0,
      hintsUsed: 0,
      data: {
        puzzle: "Four friends - Alice, Bob, Charlie, and Diana - have different favorite colors: Red, Blue, Green, and Yellow. Use the clues to determine who likes which color.",
        clues: [
          "Alice doesn't like Red or Blue",
          "Bob's favorite color isn't Green",
          "Charlie likes either Blue or Yellow",
          "Diana's favorite color comes after Green in the rainbow"
        ],
        solution: {
          'Alice': 'Green',
          'Bob': 'Red', 
          'Charlie': 'Blue',
          'Diana': 'Yellow'
        },
        playerSolution: {},
        categories: ['People', 'Colors']
      } as LogicGridState
    };
  };

  // AI DEBATE GAME
  const initializeAIDebate = async (): Promise<GameState> => {
    const topics = [
      "Should students have homework?",
      "Is artificial intelligence good for education?",
      "Should video games be considered a sport?",
      "Is reading books better than watching movies?"
    ];

    const topic = topics[Math.floor(Math.random() * topics.length)];

    return {
      gameId: 'ai-debate',
      stage: 'playing',
      score: 0,
      hintsUsed: 0,
      data: {
        topic,
        debaterA: {
          name: "Logic Larry",
          position: "For",
          points: [
            "Promotes independent learning and practice",
            "Reinforces classroom lessons",
            "Teaches time management skills"
          ]
        },
        debaterB: {
          name: "Freedom Fiona", 
          position: "Against",
          points: [
            "Students need time for extracurricular activities",
            "Can cause unnecessary stress and burnout",
            "Not all students have equal resources at home"
          ]
        },
        userVote: null,
        round: 1
      } as DebateState
    };
  };

  const castVote = (debater: string) => {
    if (!gameState) return;

    setGameState(prev => prev ? {
      ...prev,
      stage: 'completed',
      score: 50,
      data: {
        ...prev.data,
        userVote: debater
      }
    } : null);

    playSound('complete');
    toast({
      title: "Vote Cast! 🗳️",
      description: `You voted for ${debater}`,
    });
  };

  // QUIZ RUSH GAME
  const initializeQuizRush = async (): Promise<GameState> => {
    const questions = [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and most populous city of France."
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars appears red due to iron oxide (rust) on its surface."
      },
      {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: 1,
        explanation: "The blue whale is the largest animal known to have ever existed."
      }
    ];

    return {
      gameId: 'quiz-rush',
      stage: 'playing',
      score: 0,
      hintsUsed: 0,
      data: {
        questions,
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null
      } as QuizState
    };
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!gameState) return;

    const currentData = gameState.data as QuizState;
    const currentQ = currentData.questions[currentData.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;

    setGameState(prev => prev ? {
      ...prev,
      data: {
        ...currentData,
        selectedAnswer: answerIndex,
        score: currentData.score + (isCorrect ? 10 : 0)
      }
    } : null);

    playSound(isCorrect ? 'success' : 'error');

    // Move to next question after delay
    setTimeout(() => {
      if (currentData.currentQuestion < currentData.questions.length - 1) {
        setGameState(prev => prev ? {
          ...prev,
          data: {
            ...currentData,
            currentQuestion: currentData.currentQuestion + 1,
            selectedAnswer: null
          }
        } : null);
      } else {
        setGameState(prev => prev ? { ...prev, stage: 'completed' } : null);
        playSound('complete');
      }
    }, 2000);
  };

  // Render game-specific UI
  const renderGame = () => {
    if (!gameState || !selectedGame) return null;

    switch (selectedGame) {
      case 'word-morph':
        return renderWordMorph();
      case 'riddle-me':
        return renderRiddleMe();
      case 'quickdraw-ai':
        return renderQuickDraw();
      case 'logic-grid':
        return renderLogicGrid();
      case 'ai-debate':
        return renderAIDebate();
      case 'quiz-rush':
        return renderQuizRush();
      default:
        return null;
    }
  };

  const renderWordMorph = () => {
    const data = gameState!.data as WordMorphState;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Transform the Word</h3>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="text-2xl font-bold text-blue-400">{data.startWord}</div>
            <div className="text-lg">→</div>
            <div className="text-2xl font-bold text-green-400">{data.targetWord}</div>
          </div>
          <p className="text-sm text-muted-foreground">
            Change one letter at a time to transform {data.startWord} into {data.targetWord}
          </p>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <div className="font-mono text-lg text-center mb-4">
            Current: <span className="font-bold text-primary">{data.currentWord}</span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.toUpperCase())}
              placeholder="Enter next word..."
              className="text-center font-mono uppercase"
              maxLength={data.currentWord.length}
            />
            <Button onClick={handleWordMorphSubmit} disabled={!userInput.trim()}>
              Submit
            </Button>
          </div>

          <div className="text-sm space-y-1">
            <div>Steps: {data.steps.length - 1} / {data.maxSteps}</div>
            <div>Score: {gameState!.score}</div>
          </div>
        </div>

        <div className="bg-muted/10 rounded-lg p-4">
          <h4 className="font-bold mb-2">Word Path:</h4>
          <div className="flex flex-wrap gap-2">
            {data.steps.map((step, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  index === 0 
                    ? 'bg-blue-500 text-white' 
                    : index === data.steps.length - 1
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRiddleMe = () => {
    const data = gameState!.data as RiddleState;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Solve the Riddle</h3>
          <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
            <p className="text-lg italic mb-4">"{data.riddle}"</p>
            <div className="text-sm text-muted-foreground">
              Attempts: {data.attempts} | Hints Used: {gameState!.hintsUsed}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Your answer..."
            className="flex-1"
          />
          <Button onClick={handleRiddleSubmit} disabled={!userInput.trim()}>
            Submit
          </Button>
          <Button 
            variant="outline" 
            onClick={giveRiddleHint}
            disabled={gameState!.hintsUsed >= data.hints.length}
          >
            Hint ({gameState!.hintsUsed}/{data.hints.length})
          </Button>
        </div>

        {gameState!.stage === 'hint' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="font-bold text-yellow-400 mb-2">Hint #{gameState!.hintsUsed}:</h4>
            <p>{data.hints[gameState!.hintsUsed - 1]}</p>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Score: {gameState!.score} | Max possible: {50 - (gameState!.hintsUsed * 10)}
        </div>
      </div>
    );
  };

  const renderQuickDraw = () => {
    const data = gameState!.data as QuickDrawState;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">QuickDraw AI</h3>
          <p className="text-lg mb-4">Draw: <span className="font-bold text-primary">{data.wordToDraw}</span></p>
          <div className="text-sm text-muted-foreground mb-4">
            Round {data.round}/3 | Score: {data.score}
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-48 bg-background border border-border rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={submitDrawing} disabled={drawing.length === 0}>
            Submit Drawing
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setDrawing([]);
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
              }
            }}
          >
            Clear
          </Button>
        </div>

        {data.aiGuess && (
          <div className={`p-4 rounded-lg text-center ${
            data.aiGuess === data.wordToDraw 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <h4 className="font-bold mb-2">AI Guess:</h4>
            <p className="text-lg">{data.aiGuess}</p>
            {data.aiGuess === data.wordToDraw ? (
              <p className="text-sm text-green-400">Correct! +25 points</p>
            ) : (
              <p className="text-sm text-red-400">Not quite! Try again next round</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLogicGrid = () => {
    const data = gameState!.data as LogicGridState;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Logic Grid Puzzle</h3>
          <div className="bg-muted/20 rounded-lg p-4 mb-4">
            <p className="mb-4">{data.puzzle}</p>
            <div className="text-left space-y-2">
              {data.clues.map((clue, index) => (
                <p key={index} className="text-sm">• {clue}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-muted/10 rounded-lg p-4">
          <h4 className="font-bold mb-4">Solution Grid (Interactive):</h4>
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div></div>
            <div className="text-center font-bold">Red</div>
            <div className="text-center font-bold">Blue</div>
            <div className="text-center font-bold">Green</div>
            <div className="text-center font-bold">Yellow</div>
            
            {['Alice', 'Bob', 'Charlie', 'Diana'].map(person => (
              <>
                <div className="font-bold">{person}</div>
                {['Red', 'Blue', 'Green', 'Yellow'].map(color => (
                  <div key={color} className="text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={data.playerSolution[person] === color}
                      onChange={() => {
                        // Toggle selection logic would go here
                      }}
                    />
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>

        <Button onClick={() => {
          // Check solution logic would go here
          setGameState(prev => prev ? { ...prev, stage: 'completed', score: 75 } : null);
          playSound('complete');
        }}>
          Check Solution
        </Button>
      </div>
    );
  };

  const renderAIDebate = () => {
    const data = gameState!.data as DebateState;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">AI Debate</h3>
          <div className="bg-muted/20 rounded-lg p-4 mb-4">
            <p className="text-lg font-bold">Topic: "{data.topic}"</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Debater A */}
          <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <h4 className="font-bold text-lg text-blue-400 mb-2">{data.debaterA.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">Position: {data.debaterA.position}</p>
            <div className="space-y-2">
              {data.debaterA.points.map((point, index) => (
                <div key={index} className="text-sm bg-blue-500/10 p-2 rounded">
                  • {point}
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
              onClick={() => castVote(data.debaterA.name)}
              disabled={data.userVote !== null}
            >
              Vote for {data.debaterA.name}
            </Button>
          </Card>

          {/* Debater B */}
          <Card className="p-4 bg-purple-500/10 border-purple-500/20">
            <h4 className="font-bold text-lg text-purple-400 mb-2">{data.debaterB.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">Position: {data.debaterB.position}</p>
            <div className="space-y-2">
              {data.debaterB.points.map((point, index) => (
                <div key={index} className="text-sm bg-purple-500/10 p-2 rounded">
                  • {point}
                </div>
              ))}
            </div>
            <Button 
              className="w-full mt-4 bg-purple-500 hover:bg-purple-600"
              onClick={() => castVote(data.debaterB.name)}
              disabled={data.userVote !== null}
            >
              Vote for {data.debaterB.name}
            </Button>
          </Card>
        </div>

        {data.userVote && (
          <div className="text-center p-4 bg-green-500/20 rounded-lg">
            <p className="text-green-400 font-bold">You voted for {data.userVote}!</p>
            <p className="text-sm mt-2">+50 points awarded</p>
          </div>
        )}
      </div>
    );
  };

  const renderQuizRush = () => {
    const data = gameState!.data as QuizState;
    const currentQ = data.questions[data.currentQuestion];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Quiz Rush</h3>
          <div className="text-sm text-muted-foreground mb-4">
            Question {data.currentQuestion + 1} of {data.questions.length} | Score: {data.score}
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-6 border border-border/30">
          <h4 className="text-lg font-bold mb-4">{currentQ.question}</h4>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={data.selectedAnswer === index ? "default" : "outline"}
                className={`w-full justify-start h-auto py-3 ${
                  data.selectedAnswer !== null && 
                  index === currentQ.correctAnswer 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : data.selectedAnswer === index && 
                      data.selectedAnswer !== currentQ.correctAnswer
                    ? 'bg-red-500 hover:bg-red-600'
                    : ''
                }`}
                onClick={() => handleQuizAnswer(index)}
                disabled={data.selectedAnswer !== null}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>

          {data.selectedAnswer !== null && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="font-bold mb-2">
                {data.selectedAnswer === currentQ.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-sm">{currentQ.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render completion screen
  const renderCompletion = () => {
    if (!gameState || gameState.stage !== 'completed') return null;

    return (
      <div className="text-center space-y-4 p-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Game Completed! 🎉</h3>
        <p className="text-lg">Final Score: <span className="font-bold text-primary">{gameState.score}</span></p>
        <p className="text-muted-foreground">
          {user ? `Great job, ${user.displayName || 'Player'}!` : 'Great job!'}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => startGame(selectedGame!)}>
            Play Again
          </Button>
          <Button variant="outline" onClick={() => {
            setSelectedGame(null);
            setGameState(null);
          }}>
            Back to Games
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold neon-glow mb-2">AI Mind Games</h1>
          <p className="text-muted-foreground">Challenge your brain with AI-powered games</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="rounded-full"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Game Selection or Active Game */}
      {!selectedGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card
                key={game.id}
                className="glass-panel glass-panel-hover border-0 p-6 cursor-pointer group"
                onClick={() => startGame(game.id)}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : "Play Now"}
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-panel border-0 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold neon-glow">
              {games.find(g => g.id === selectedGame)?.title}
            </h2>
            <div className="flex items-center gap-4">
              {gameState && gameState.stage !== 'completed' && (
                <div className="text-sm bg-muted/20 px-3 py-1 rounded-full">
                  Score: <span className="font-bold">{gameState.score}</span>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGame(null);
                  setGameState(null);
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
              >
                Back to Games
              </Button>
            </div>
          </div>

          {gameState?.stage === 'completed' ? renderCompletion() : renderGame()}
        </Card>
      )}
    </div>
  );
};

export default AIMindGames;
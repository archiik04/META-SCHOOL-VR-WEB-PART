import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Play, Pause, Download, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudiobookItem {
  id: string;
  title: string;
  text: string;
  audioUrl?: string;
}

const AIAudiobooks = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [library, setLibrary] = useState<AudiobookItem[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Simple text examples instead of API calls
  const predefinedTopics = [
    {
      id: "solar-system",
      title: "Solar System",
      text: "Our solar system consists of the Sun and everything bound to it by gravity. The eight planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. There are also dwarf planets like Pluto, numerous moons, and millions of asteroids, comets, and meteoroids. The solar system formed about 4.6 billion years ago from a giant cloud of gas and dust."
    },
    {
      id: "newton-laws", 
      title: "Newton's Laws",
      text: "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force. The Second Law explains how force equals mass times acceleration. The Third Law tells us that for every action, there is an equal and opposite reaction. These laws form the foundation of classical mechanics."
    },
    {
      id: "photosynthesis",
      title: "Photosynthesis", 
      text: "Photosynthesis is the process plants use to convert sunlight into energy. Using chlorophyll, plants take in carbon dioxide and water, and with the help of sunlight, produce glucose and oxygen. This amazing process provides the oxygen we breathe and forms the base of most food chains on Earth."
    }
  ];

  const generateAudiobook = async (content: { title: string; text: string }) => {
    setLoading(true);
    
    try {
      // Use the browser's built-in speech synthesis
      if ('speechSynthesis' in window) {
        const newAudiobook: AudiobookItem = {
          id: Date.now().toString(),
          title: content.title,
          text: content.text,
          // No audio URL needed for browser speech
        };
        
        setLibrary(prev => [newAudiobook, ...prev]);
        setText(content.text);
        
        toast({
          title: "Audiobook Ready! 🎧",
          description: `"${content.title}" is ready to listen`,
        });
      } else {
        throw new Error("Speech synthesis not supported in this browser");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create audiobook",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      // Stop any currently playing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower speed for better understanding
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setPlayingId(id);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => {
        setPlayingId(null);
        toast({
          title: "Playback Error",
          description: "Failed to play audio",
          variant: "destructive"
        });
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    }
  };

  const handleQuickGenerate = (topic: typeof predefinedTopics[0]) => {
    generateAudiobook(topic);
  };

  const handleCustomGenerate = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text",
        variant: "destructive"
      });
      return;
    }
    
    generateAudiobook({
      title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
      text: text
    });
  };

  const togglePlay = (item: AudiobookItem) => {
    if (playingId === item.id) {
      stopSpeech();
    } else {
      speakText(item.text, item.id);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">AI Audiobooks</h1>
        <p className="text-gray-600">Listen to educational content</p>
      </div>

      {/* Quick Generate Cards */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predefinedTopics.map((topic) => (
            <Card key={topic.id} className="p-4 border hover:border-blue-500 transition-colors">
              <div className="text-center space-y-3">
                <BookOpen className="w-8 h-8 mx-auto text-blue-500" />
                <h3 className="font-semibold">{topic.title}</h3>
                <Button
                  onClick={() => handleQuickGenerate(topic)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Loading..." : "Generate"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Custom Input */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Custom Content</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your educational content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[150px]"
          />
          <Button 
            onClick={handleCustomGenerate}
            disabled={loading || !text.trim()}
            className="w-full"
          >
            {loading ? "Generating..." : "Create Audiobook"}
          </Button>
        </div>
      </Card>

      {/* Library */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Library</h2>
        
        {library.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No audiobooks yet. Generate one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {library.map((item) => (
              <Card key={item.id} className="p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.text}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={playingId === item.id ? "default" : "outline"}
                      onClick={() => togglePlay(item)}
                    >
                      {playingId === item.id ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {playingId === item.id && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>Powered by Open AI Text To Speech Model</p>
      </div>
    </div>
  );
};

export default AIAudiobooks;
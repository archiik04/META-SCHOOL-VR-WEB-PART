import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Film, Play, Download, Loader2, Star, History, Trash2, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Video {
  name: string;
  path: string;
}

const VideoGenerator = () => {
  const [formData, setFormData] = useState({
    topic: "",
    duration: "60",
    keyPoints: "",
    style: "educational"
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();

  // Fetch videos from API - matching your Flask endpoint
  const fetchVideos = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('http://10.10.20.208:5000/api/videos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const videosData = await response.json();
      
      if (Array.isArray(videosData)) {
        setVideos(videosData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Failed to load videos",
        description: error instanceof Error ? error.message : "Could not fetch videos",
        variant: "destructive"
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load videos when showing history
  useEffect(() => {
    if (showHistory) {
      fetchVideos();
    }
  }, [showHistory]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim() || !formData.keyPoints.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    setVideoUrl(null);

    try {
      const requestData = {
        topic: formData.topic,
        duration: parseInt(formData.duration),
        key_points: formData.keyPoints.split('\n').map(k => k.trim()),
        style: formData.style
      };

      const response = await fetch('http://10.10.20.208:5000/videogen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProgress(100);
        const fullVideoUrl = `http://10.10.20.208:5000/static/videos/${data.videoPath}`;
        setVideoUrl(fullVideoUrl);
        
        toast({
          title: "Success!",
          description: "Your video has been generated successfully",
        });

        // Refresh videos after generating a new one
        if (showHistory) {
          // Wait a moment for the file to be written, then refresh
          setTimeout(() => {
            fetchVideos();
          }, 1000);
        }
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate video",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = (videoPath: string) => {
    // Convert the local path to full URL for download
    const fullUrl = videoPath.startsWith('http') 
      ? videoPath 
      : `http://10.10.20.208:5000/${videoPath.replace('./static/', 'static/')}`;
    
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = videoPath.split("/").pop() || "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const playVideo = (videoPath: string) => {
    // Convert the local path to full URL for playback
    const fullUrl = videoPath.startsWith('http') 
      ? videoPath 
      : `http://10.10.20.208:5000/${videoPath.replace('./static/', 'static/')}`;
    
    window.open(fullUrl, '_blank');
  };

  const deleteVideo = async (videoName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const response = await fetch(`/api/videos/${videoName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setVideos(prev => prev.filter(video => video.name !== videoName));
        
        toast({
          title: "Deleted",
          description: "Video removed successfully",
        });
      } else {
        throw new Error(data.error || "Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete video",
        variant: "destructive"
      });
    }
  };

  const refreshVideos = () => {
    fetchVideos();
    toast({
      title: "Refreshing",
      description: "Fetching latest videos...",
    });
  };

  const formatVideoName = (filename: string) => {
    // Remove file extension and replace underscores with spaces
    return filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  const getVideoUrl = (videoPath: string) => {
    return videoPath.startsWith('http') 
      ? videoPath 
      : `http://10.10.20.208:5000/${videoPath.replace('./static/', 'static/')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Generator</h1>
          <p className="text-muted-foreground mt-2">
            Create AI-powered educational videos with our advanced generator
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border">
            <Star className="w-4 h-4" />
            AI-POWERED
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            {showHistory ? "Back to Generator" : "View History"}
            {videos.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-5 h-5 flex items-center justify-center">
                {videos.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {showHistory ? (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Generated Videos ({videos.length})</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={refreshVideos} 
                disabled={loadingHistory}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {loadingHistory ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No videos found</p>
              <p className="text-sm">Generate your first video to see it here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="historyList">
              {videos.map((video, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {formatVideoName(video.name)}
                    </h3>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => deleteVideo(video.name, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="aspect-video bg-black rounded-lg mb-3 flex items-center justify-center">
                    <video
                      controls
                      className="w-full h-full rounded-lg"
                      preload="metadata"
                      src={getVideoUrl(video.path)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => playVideo(video.path)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => downloadVideo(video.path)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Video Configuration</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Video Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="topic" className="text-sm font-medium mb-2 block">
                        Topic
                      </label>
                      <Input
                        id="topic"
                        placeholder="Enter the video topic"
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="duration" className="text-sm font-medium mb-2 block">
                        Duration (seconds)
                      </label>
                      <Input
                        id="duration"
                        type="number"
                        min="10"
                        max="300"
                        placeholder="Enter duration in seconds"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="keyPoints" className="text-sm font-medium mb-2 block">
                        Key Points (one per line)
                      </label>
                      <Textarea
                        id="keyPoints"
                        placeholder="Enter key points, one per line"
                        value={formData.keyPoints}
                        onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="style" className="text-sm font-medium mb-2 block">
                        Video Style
                      </label>
                      <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                          <SelectItem value="futuristic">Futuristic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Video Preview</h2>
              
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Preview will appear here</p>
                  </div>
                )}
              </div>

              {loading && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Generation Status</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {progress < 100 ? "Generating video..." : "Generation complete!"}
                  </p>
                </div>
              )}

              {videoUrl && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => downloadVideo(videoUrl)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <Star className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <span>Be specific with your topic for better results</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <span>Separate key points with commas</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  <span>Optimal duration is between 30-120 seconds</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
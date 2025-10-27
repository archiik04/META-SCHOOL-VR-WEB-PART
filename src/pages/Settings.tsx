import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Key, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name,
        updatedAt: new Date().toISOString()
      });
      
      toast({
        title: "Settings Saved ✅",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold neon-glow mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your classroom preferences</p>
        </div>
        <SettingsIcon className="w-12 h-12 text-accent neon-glow-cyan" />
      </div>

      {/* User Profile */}
      <Card className="glass-panel border-0 p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold neon-glow-cyan">Profile Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Display Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-muted/20 border-border/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              value={user?.email || ""}
              readOnly
              className="bg-muted/20 border-border/30 opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="glass-panel border-0 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold neon-glow">API Keys (System Configured)</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
            <Input
              type="password"
              value="••••••••••••••••"
              readOnly
              className="bg-muted/20 border-border/30 opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">Used for AI Mind Games</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">ElevenLabs API Key</label>
            <Input
              type="password"
              value="••••••••••••••••"
              readOnly
              className="bg-muted/20 border-border/30 opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">Used for AI Audiobooks</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Google Calendar API Key</label>
            <Input
              type="password"
              value="••••••••••••••••"
              readOnly
              className="bg-muted/20 border-border/30 opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">Used for Class Schedule</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          {loading ? "Saving..." : "Save Settings 💾"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;

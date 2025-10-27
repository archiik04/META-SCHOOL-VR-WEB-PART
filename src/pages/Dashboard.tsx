import { useEffect, useState } from "react";
// Updated icons for a cleaner look and for the new Quick Actions section
import { 
  Users, 
  TrendingUp, 
  Award, 
  Calendar, 
  Sparkles,
  BookAudio,
  PlayCircle,
  ClipboardCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn/ui Card structure
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// A simple progress bar component to show XP progress, adds a nice visual touch.
const ProgressBar = ({ value, max }: { value: number, max: number }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-500" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};


const Dashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState("Analyzing your recent activity to generate personalized insights...");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();

    // Simulate AI-generated insight with a more professional tone
    setTimeout(() => {
      setAiInsight("AI Powered SmartBoard");
    }, 2000);
  }, [user]);

  // --- Data remains the same, no changes needed here ---
  const performanceData = [
    { day: 'Mon', score: 65 }, { day: 'Tue', score: 72 }, { day: 'Wed', score: 68 },
    { day: 'Thu', score: 78 }, { day: 'Fri', score: 85 }, { day: 'Sat', score: 82 },
    { day: 'Sun', score: 88 },
  ];

  const activityData = [
    { time: '9AM', activities: 2 }, { time: '10AM', activities: 5 }, { time: '11AM', activities: 8 },
    { time: '12PM', activities: 6 }, { time: '1PM', activities: 4 }, { time: '2PM', activities: 9 },
    { time: '3PM', activities: 7 },
  ];
  
  // Refactored stats for a cleaner, vertical layout inside the cards
  const stats = [
    { icon: Users, label: "Active Students", value: "12" },
    { icon: TrendingUp, label: "Avg. Performance", value: "85%" },
    { icon: Award, label: "Games Completed", value: "48" },
    { icon: Calendar, label: "Classes Today", value: "3" },
  ];

  const recentActivity = [
    { student: "Bakshi", activity: "Completed 'Word Morph'", time: "5m ago", score: 95 },
    { student: "Archi", activity: "Generated an Audiobook for 'The Great Gatsby'", time: "12m ago", score: null },
    { student: "G. Kumar", activity: "Achieved a new high score in 'QuizRush'", time: "18m ago", score: 100 },
    { student: "Rahul", activity: "Solved 'RiddleMe' in under 2 minutes", time: "23m ago", score: 88 },
  ];

  // Quick Actions data for a more scalable and cleaner component
  const quickActions = [
      { icon: PlayCircle, title: "Start a Game", description: "Launch AI-powered mind games." },
      { icon: BookAudio, title: "Generate Audiobook", description: "Turn any text into an audio story." },
      { icon: ClipboardCheck, title: "Take Attendance", description: "Quickly mark student presence." }
  ];


  // DUMMY DATA: Assuming user needs 1000 XP for the next level
  const userLevel = userData?.level || 1;
  const userXp = userData?.xp || 0;
  const xpToNextLevel = userLevel * 1000;

  return (
    // Increased spacing for a more breathable layout
    <div className="space-y-8 animate-fade-in p-2 md:p-4">
      {/* SECTION 1: Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          {/* Changed typography: larger, bolder heading and softer subtitle */}
          <h1 className="text-3xl md:text-4xl font-bold text-card-foreground">
            Welcome back, {userData?.name || user?.email?.split('@')[0] || 'Student'}
          </h1>
          <p className="text-muted-foreground mt-1">Here's your summary for today.</p>
        </div>
        
        {/* Replaced the circle with a cleaner card for Level and XP */}
        <Card className="w-full md:w-auto md:min-w-[250px]">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-card-foreground">Level {userLevel}</p>
                    <p className="text-sm font-medium text-primary">{userXp} / {xpToNextLevel} XP</p>
                </div>
                <ProgressBar value={userXp} max={xpToNextLevel} />
            </CardContent>
        </Card>
      </div>

      {/* SECTION 2: AI Insights */}
      <Card className="bg-muted/50 border-none">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
            
          </div>
          <div className="flex-1">
            <h3 className="text-md font-semibold text-card-foreground mb-1">The SmartBoard For MetaVerse</h3>
            <p className="text-muted-foreground text-sm">{aiInsight}</p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            {/* Using CardHeader and CardContent for better semantic structure */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SECTION 4: Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
                <defs>
                  {/* Softer gradient for a more subtle effect */}
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                {/* Made the grid lines much fainter for a cleaner look */}
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}/>
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Note: In a real-world scenario, the second chart would be different.
            For this example, we reuse the AreaChart structure for a consistent look. */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}/>
                <Area type="monotone" dataKey="activities" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorActivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 5: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {recentActivity.map((activity, index) => (
                        // Replaced cards with a cleaner list + divider format
                        <div 
                            key={index}
                            className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1 pr-4">
                                <p className="font-semibold text-sm">{activity.student}</p>
                                <p className="text-sm text-muted-foreground">{activity.activity}</p>
                            </div>
                            <div className="text-right">
                                {activity.score !== null && (
                                    <p className={`text-md font-bold ${activity.score >= 90 ? 'text-green-500' : 'text-card-foreground'}`}>
                                        {activity.score}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold px-2">Quick Actions</h3>
          {quickActions.map((action, index) => (
             <Card key={index} className="hover:border-primary/50 transition-all cursor-pointer">
                 <CardContent className="p-4 flex items-center gap-4">
                     <div className="p-2 bg-muted rounded-lg">
                        <action.icon className="w-6 h-6 text-primary" />
                     </div>
                     <div>
                         <h4 className="font-semibold">{action.title}</h4>
                         <p className="text-sm text-muted-foreground">{action.description}</p>
                     </div>
                 </CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
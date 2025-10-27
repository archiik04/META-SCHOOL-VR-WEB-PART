import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  present: boolean;
  avatar: string;
}

const Attendance = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Bakshi", present: false, avatar: "🧑" },
    { id: "2", name: "Archi", present: false, avatar: "👧" },
    { id: "3", name: "GK", present: false, avatar: "👦" },
    { id: "4", name: "Rahul", present: false, avatar: "🧑" },
    { id: "5", name: "Ravi", present: false, avatar: "👨" },
    { id: "6", name: "Krishna", present: false, avatar: "🧑" },
    { id: "7", name: "Kishn", present: false, avatar: "👦" },
    { id: "8", name: "Aarju", present: false, avatar: "👧" },
    { id: "9", name: "Aarvi", present: false, avatar: "👧" },
    { id: "10", name: "Mahi", present: false, avatar: "👧" },
    { id: "11", name: "Aaditya", present: false, avatar: "🧑" },
    { id: "12", name: "Aditya", present: false, avatar: "👦" },
  ]);

  const toggleAttendance = (id: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: true })));
    toast({
      title: "All Marked Present ✅",
      description: "All students marked as present",
    });
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: false })));
    toast({
      title: "All Marked Absent ❌",
      description: "All students marked as absent",
    });
  };

  const saveAttendance = () => {
    const presentCount = students.filter(s => s.present).length;
    const absentCount = students.length - presentCount;
    
    // In a real app, this would save to Google Sheets API
    toast({
      title: "Attendance Saved! 📊",
      description: `Present: ${presentCount} | Absent: ${absentCount}`,
    });
  };

  const presentCount = students.filter(s => s.present).length;
  const attendancePercentage = ((presentCount / students.length) * 100).toFixed(0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold neon-glow mb-2">Attendance</h1>
          <p className="text-muted-foreground">Mark student presence for today</p>
        </div>
        <Users className="w-12 h-12 text-accent neon-glow-cyan" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-panel border-0 p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Students</p>
          <p className="text-3xl font-bold">{students.length}</p>
        </Card>
        <Card className="glass-panel border-0 p-6">
          <p className="text-sm text-muted-foreground mb-1">Present Today</p>
          <p className="text-3xl font-bold text-green-500">{presentCount}</p>
        </Card>
        <Card className="glass-panel border-0 p-6">
          <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
          <p className="text-3xl font-bold text-primary">{attendancePercentage}%</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          onClick={markAllPresent}
          className="bg-gradient-to-r from-green-500 to-emerald-500"
        >
          <Check className="w-4 h-4 mr-2" />
          Mark All Present
        </Button>
        <Button
          onClick={markAllAbsent}
          variant="outline"
        >
          <X className="w-4 h-4 mr-2" />
          Mark All Absent
        </Button>
      </div>

      {/* Student List */}
      <Card className="glass-panel border-0 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                student.present
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-muted/20 border-border/30"
              }`}
              onClick={() => toggleAttendance(student.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl">{student.avatar}</div>
                <div className="flex-1">
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.present ? "Present" : "Absent"}
                  </p>
                </div>
                <Checkbox
                  checked={student.present}
                  onCheckedChange={() => toggleAttendance(student.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={saveAttendance}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Save Attendance 💾
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Attendance;
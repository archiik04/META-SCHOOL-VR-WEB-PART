import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const scheduleData = [
    {
      day: "Monday",
      date: getDateForDay(1, currentWeek),
      classes: [
        { subject: "Physics", time: "9:00 AM - 10:30 AM", topic: "Quantum Mechanics", teacher: "Dr. Smith", room: "Lab A" },
        { subject: "Chemistry", time: "11:00 AM - 12:30 PM", topic: "Organic Reactions", teacher: "Prof. Johnson", room: "Lab B" },
        { subject: "Mathematics", time: "2:00 PM - 3:30 PM", topic: "Calculus II", teacher: "Dr. Williams", room: "Room 301" },
      ]
    },
    {
      day: "Tuesday",
      date: getDateForDay(2, currentWeek),
      classes: [
        { subject: "Mathematics", time: "9:00 AM - 10:30 AM", topic: "Linear Algebra", teacher: "Dr. Williams", room: "Room 301" },
        { subject: "Physics", time: "11:00 AM - 12:30 PM", topic: "Thermodynamics", teacher: "Dr. Smith", room: "Lab A" },
        { subject: "Chemistry", time: "2:00 PM - 3:30 PM", topic: "Molecular Structure", teacher: "Prof. Johnson", room: "Lab B" },
      ]
    },
    {
      day: "Wednesday",
      date: getDateForDay(3, currentWeek),
      classes: [
        { subject: "Chemistry", time: "9:00 AM - 10:30 AM", topic: "Chemical Kinetics", teacher: "Prof. Johnson", room: "Lab B" },
        { subject: "Mathematics", time: "11:00 AM - 12:30 PM", topic: "Differential Equations", teacher: "Dr. Williams", room: "Room 301" },
        { subject: "Physics", time: "2:00 PM - 3:30 PM", topic: "Electromagnetism", teacher: "Dr. Smith", room: "Lab A" },
      ]
    },
    {
      day: "Thursday",
      date: getDateForDay(4, currentWeek),
      classes: [
        { subject: "Physics", time: "9:00 AM - 10:30 AM", topic: "Wave Optics", teacher: "Dr. Smith", room: "Lab A" },
        { subject: "Chemistry", time: "11:00 AM - 12:30 PM", topic: "Electrochemistry", teacher: "Prof. Johnson", room: "Lab B" },
        { subject: "Mathematics", time: "2:00 PM - 3:30 PM", topic: "Statistics", teacher: "Dr. Williams", room: "Room 301" },
      ]
    },
    {
      day: "Friday",
      date: getDateForDay(5, currentWeek),
      classes: [
        { subject: "Mathematics", time: "9:00 AM - 10:30 AM", topic: "Probability Theory", teacher: "Dr. Williams", room: "Room 301" },
        { subject: "Physics", time: "11:00 AM - 12:30 PM", topic: "Atomic Structure", teacher: "Dr. Smith", room: "Lab A" },
        { subject: "Chemistry", time: "2:00 PM - 3:30 PM", topic: "Lab Session", teacher: "Prof. Johnson", room: "Lab B" },
      ]
    }
  ];

  function getDateForDay(dayOfWeek: number, weekStart: Date) {
    const date = new Date(weekStart);
    const currentDay = date.getDay();
    const diff = dayOfWeek - currentDay;
    date.setDate(date.getDate() + diff);
    return date;
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    const end = new Date(start);
    end.setDate(end.getDate() + 4); // End on Friday
    
    return {
      start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, { bg: string, border: string }> = {
      "Physics": {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800"
      },
      "Chemistry": {
        bg: "bg-emerald-50 dark:bg-emerald-950/20", 
        border: "border-emerald-200 dark:border-emerald-800"
      },
      "Mathematics": {
        bg: "bg-violet-50 dark:bg-violet-950/20",
        border: "border-violet-200 dark:border-violet-800"
      },
    };
    return colors[subject] || {
      bg: "bg-gray-50 dark:bg-gray-950/20",
      border: "border-gray-200 dark:border-gray-800"
    };
  };

  const weekRange = getWeekRange(currentWeek);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-premium mb-2">
              Class Schedule
            </h1>
            <p className="text-muted-foreground">Weekly timetable</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Week Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateWeek('prev')}
                className="surface-card p-2 rounded-lg hover:bg-accent/5 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center min-w-[120px]">
                <p className="text-sm font-medium text-premium">
                  {weekRange.start} - {weekRange.end}
                </p>
                <p className="text-xs text-muted">
                  {currentWeek.getFullYear()}
                </p>
              </div>
              
              <button
                onClick={() => navigateWeek('next')}
                className="surface-card p-2 rounded-lg hover:bg-accent/5 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="surface-card p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {scheduleData.map((daySchedule, dayIndex) => {
            const today = isToday(daySchedule.date);
            
            return (
              <Card 
                key={dayIndex} 
                className={`
                  surface-card-hover p-4 relative
                  ${today ? 'ring-1 ring-accent/20' : ''}
                `}
              >
                {/* Day Header */}
                <div className="text-center mb-4 pb-3 border-b border-border">
                  <div className={`text-sm font-medium ${
                    today ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {daySchedule.day.toUpperCase()}
                  </div>
                  <div className={`text-2xl font-semibold mt-1 ${
                    today ? 'text-accent' : 'text-premium'
                  }`}>
                    {daySchedule.date.getDate()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {daySchedule.date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>

                {/* Classes */}
                <div className="space-y-3">
                  {daySchedule.classes.map((classItem, classIndex) => {
                    const subjectColors = getSubjectColor(classItem.subject);
                    return (
                      <div
                        key={classIndex}
                        className={`p-3 rounded-lg border ${subjectColors.bg} ${subjectColors.border} transition-all duration-200 hover:shadow-sm`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-premium">
                            {classItem.subject}
                          </h3>
                          <span className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground font-medium">
                            {classItem.time.split(' - ')[0]}
                          </span>
                        </div>
                        
                        <p className="text-sm text-premium font-medium mb-2 line-clamp-2">
                          {classItem.topic}
                        </p>
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{classItem.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{classItem.room}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{classItem.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Day Summary */}
                {daySchedule.classes.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{daySchedule.classes.length} classes</span>
                      <span>{daySchedule.classes.length * 1.5}h total</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Weekend Notice */}
        <Card className="surface-card p-6 text-center">
          <div className="text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No classes scheduled for Saturday and Sunday</p>
          </div>
        </Card>

        {/* Legend */}
        <Card className="surface-card p-4">
          <h3 className="text-sm font-semibold text-premium mb-3">Schedule Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">Physics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-muted-foreground">Chemistry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-sm text-muted-foreground">Mathematics</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
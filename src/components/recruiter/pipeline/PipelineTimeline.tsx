
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const timelineEvents = [
  {
    title: "Sarah Wilson",
    description: "Moved to Interview stage",
    time: "2h ago",
    type: "progress",
  },
  {
    title: "Mike Johnson",
    description: "Assessment completed",
    time: "4h ago",
    type: "complete",
  },
  {
    title: "Emma Davis",
    description: "New application received",
    time: "5h ago",
    type: "new",
  },
  {
    title: "Alex Thompson",
    description: "Offer accepted",
    time: "1d ago",
    type: "success",
  },
  {
    title: "Rachel Brown",
    description: "Interview scheduled",
    time: "1d ago",
    type: "progress",
  }
];

const getEventBadge = (type: string) => {
  switch (type) {
    case "progress":
      return <Badge className="bg-blue-500 shadow-sm">In Progress</Badge>;
    case "complete":
      return <Badge className="bg-purple-500 shadow-sm">Completed</Badge>;
    case "new":
      return <Badge variant="outline" className="shadow-sm">New</Badge>;
    case "success":
      return <Badge className="bg-green-500 shadow-sm">Success</Badge>;
    default:
      return <Badge variant="secondary" className="shadow-sm">{type}</Badge>;
  }
};

export const PipelineTimeline = () => {
  return (
    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="relative flex h-2 w-2 mt-2">
                <div className={`absolute inline-flex h-2 w-2 rounded-full bg-primary`} />
                {index !== timelineEvents.length - 1 && (
                  <div className="absolute h-16 w-px bg-border left-1" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{event.title}</p>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
                <div className="pt-1">
                  {getEventBadge(event.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

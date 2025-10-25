import { users } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Flame, MessageCircle, Star, UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Meet the talented individuals driving this project forward.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id} className="flex flex-col">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.role}</p>
                </CardContent>
                <Separator />
                <div className="p-4 grid grid-cols-2 gap-2 text-sm">
                   <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Connect
                   </Button>
                   <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                   </Button>
                   <Button variant="outline" size="sm" className="col-span-2">
                    <Star className="mr-2 h-4 w-4" />
                    Give Feedback
                   </Button>
                </div>
                 <div className="p-4 border-t bg-muted/50 flex justify-center items-center rounded-b-lg">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm font-semibold">
                      {Math.floor(Math.random() * 20) + 1} Day Streak
                    </span>
                 </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

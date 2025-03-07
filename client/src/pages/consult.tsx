import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Consult() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Consult an Expert</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Call</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Book a consultation with our insurance experts.
            </p>
            <Button>Book Appointment</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect with an available expert instantly.
            </p>
            <Button variant="secondary">Start Chat</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

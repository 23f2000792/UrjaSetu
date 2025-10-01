import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Terminal } from "lucide-react";

export default function ApiPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Developer API</h1>
      <p className="text-muted-foreground max-w-2xl">
        Integrate your applications with UrjaSetu. Access our marketplace, user data, and more through our powerful and easy-to-use APIs.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              REST / GraphQL API
            </CardTitle>
            <CardDescription>
              Access a rich set of endpoints to build powerful integrations. We will be offering both REST and GraphQL APIs to suit your needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm bg-muted p-4 rounded-md">
              Coming Soon: Endpoints for assets, marketplace orders, user portfolios, and energy data.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-6 w-6" />
              SDKs & Sandbox
            </CardTitle>
            <CardDescription>
              We will provide SDKs for popular languages and a sandbox environment for safe testing and development.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">
                SDKs for JavaScript and Python will be available to help you get started quickly.
             </p>
          </CardContent>
        </Card>
      </div>

       <div className="text-center p-8 bg-card rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Stay Tuned!</h2>
          <p className="text-muted-foreground">Our developer platform is under active development. Sign up for our newsletter to be notified when it's ready.</p>
       </div>
    </div>
  );
}

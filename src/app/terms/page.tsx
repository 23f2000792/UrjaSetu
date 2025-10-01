
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">Last Updated: October 2, 2025</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>By using the UrjaSetu platform ("Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform. These terms constitute a legally binding agreement between you and UrjaSetu.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>2. Platform Services</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>UrjaSetu provides a marketplace for tokenized solar assets and energy credits. We are not a broker, financial institution, or creditor. The Platform is a decentralized venue that allows users to interact with each other. All transactions are conducted peer-to-peer between users.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>3. User Obligations</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your account password and for any activities or actions under your account. You must comply with all applicable local, state, national, and international laws and regulations in connection with your use of the Platform.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Risk Disclosure</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>Investing in tokenized assets involves significant risk. The value of your investments can go up or down. Past performance is not indicative of future results. UrjaSetu does not provide investment advice, and you are solely responsible for your investment decisions. You should conduct your own research and consult with a financial advisor before making any investment.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>In no event shall UrjaSetu, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>6. Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        </CardContent>
      </Card>

    </div>
  );
}

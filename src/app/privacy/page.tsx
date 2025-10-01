
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last Updated: October 2, 2025</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Introduction</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>Welcome to UrjaSetu ("we," "our," "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>2. Collection of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul>
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Site.</li>
                <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., wallet addresses) that we may collect when you purchase, sell, or stake assets on our platform.</li>
                <li><strong>Data from Social Networks:</strong> User information from social networking sites, such as Google, if you connect your account to such social networks.</li>
            </ul>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>3. Use of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul>
                <li>Create and manage your account.</li>
                <li>Process transactions and send you related information, including purchase confirmations and invoices.</li>
                <li>Email you regarding your account or order.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                <li>Perform other business activities as needed.</li>
            </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Security of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>5. Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
            <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@urjasetu.com" className="underline hover:text-primary">privacy@urjasetu.com</a></p>
        </CardContent>
      </Card>

    </div>
  );
}

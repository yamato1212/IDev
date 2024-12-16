import { Card } from "@/components/ui/card";
import React from "react";

function PrivacyPolicyPage() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>

      <h2 className="mt-6 text-2xl font-medium">Article 1 (Personal Information)</h2>
      <p className="mt-2">
        "Personal Information" refers to "personal information" as defined in the Personal Information Protection Act, which means information about a living individual that can identify a specific individual by name, date of birth, address, phone number, contact information, or other descriptions, as well as data related to appearance, fingerprints, voice prints, and information that can identify a specific individual from that information alone (personal identification information), such as health insurance card numbers.
      </p>

      <h2 className="mt-6 text-2xl font-medium">Article 2 (Collection of Personal Information)</h2>
      <p className="mt-2">
        When users register for our services, we may ask for personal information such as name, date of birth, address, phone number, email address, bank account number, credit card number, and driver's license number. We may also collect transaction records containing users' personal information and payment-related information between users and our business partners (including information providers, advertisers, advertising distributors, hereinafter referred to as "Business Partners").
      </p>

      <h2 className="mt-6 text-2xl font-medium">
        Article 3 (Matters Concerning Business Partners)
      </h2>
      <h3 className="mt-4 text-lg font-medium">1. About Advertising Distribution</h3>
      <p className="mt-2 flex-wrap">
        This website uses "Google AdSense," a third-party advertising service. Advertising providers may use cookies to display ads based on users' interests. For cookie settings and details about Google AdSense, please visit 
        <span>https://support.google.com/adspolicy</span>. 
        Additionally, this website participates in the Amazon Associates Program, an affiliate program designed to provide a means for sites to earn referral fees by advertising and linking to Amazon.co.jp. Third parties may provide content and advertisements, collect information directly from visitors, and place or recognize cookies in visitors' browsers.
      </p>

      <h3 className="mt-4 text-lg font-medium">
        2. About Analytics Tools
      </h3>
      <p className="mt-2">
        This website uses "Google Analytics," an access analysis tool provided by Google. Google Analytics uses cookies to collect traffic data. This traffic data is collected anonymously and does not identify individuals. You can decline this data collection by disabling cookies in your browser settings. For more information about these terms, please click here [https://support.google.com/].
      </p>
    </div>
  );
}

export default PrivacyPolicyPage;
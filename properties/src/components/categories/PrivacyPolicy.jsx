import React from "react";
import NavBar from "../NavBar";
import "../../styles/PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <NavBar />
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="updated-date">Last Updated: October 30, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, disclose, and protect your information when you use our
            platform and services. By using our platform, you agree to this policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address,
            contact number, and profile details. We also collect non-personal data
            like device information, browser type, and IP address for analytics and
            service improvements.
          </p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Personalize user experience</li>
            <li>Send important updates or promotional content</li>
            <li>Ensure security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell or rent your personal information. However, we may share
            data with trusted service providers who help us operate our platform,
            process payments, or analyze usage—under strict confidentiality
            agreements.
          </p>
        </section>

        <section>
          <h2>5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to enhance your browsing experience, analyze site
            traffic, and serve personalized content. You may choose to disable
            cookies in your browser settings, though some features may not function
            properly.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your data only as long as necessary to fulfill the purposes
            for which it was collected or as required by law. You may request data
            deletion at any time.
          </p>
        </section>

        <section>
          <h2>7. Security of Your Information</h2>
          <p>
            We implement industry-standard security measures to protect your data
            against unauthorized access, alteration, disclosure, or destruction.
            However, no online system can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>8. Your Rights and Choices</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You can also opt out of promotional communications by
            following the unsubscribe instructions in our emails.
          </p>
        </section>

        <section>
          <h2>9. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not
            responsible for the privacy practices or content of these websites. We
            encourage you to read their privacy policies.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes
            in our practices. The latest version will always be available on our
            website, with the date of last update clearly indicated.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at{" "}
            <a href="mailto:privacy@example.com">privacy@example.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

import React from "react";
import NavBar from "../NavBar";
import "../../styles/Lotteryterms.css";

export default function Lotteryterms() {
  return (
    <div className="terms-page">
      <NavBar />
      <div className="terms-container">
        <h1>Terms and Conditions For Lottery</h1>
        <p className="updated-date">Last Updated: October 30, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to our platform. By accessing or using our website, mobile
            app, or any services we provide, you agree to be bound by these Terms
            and Conditions. Please read them carefully before using our services.
          </p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>
            To use our services, you must be at least 18 years old or have the
            consent of a legal guardian. You are responsible for ensuring that
            your use of the platform complies with all applicable laws and
            regulations.
          </p>
        </section>

        <section>
          <h2>3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. Any activity under your account is considered
            your responsibility. Notify us immediately of any unauthorized use or
            security breach.
          </p>
        </section>

        <section>
          <h2>4. Use of Services</h2>
          <p>
            You agree not to misuse our services or engage in any activity that
            disrupts or damages the integrity of our systems. Unauthorized access,
            data scraping, or reverse engineering is strictly prohibited.
          </p>
        </section>

        <section>
          <h2>5. Payments and Subscriptions</h2>
          <p>
            All purchases and subscriptions made through the platform are
            non-refundable unless otherwise stated. Prices and package details
            may change without prior notice.
          </p>
        </section>

        <section>
          <h2>6. Referral and Earnings</h2>
          <p>
            Referral earnings are calculated based on valid and verified referrals
            as per our policy. The total earnings are determined as 5% of the
            total value of the referred packages. Any misuse or fraudulent activity
            may result in forfeiture of earnings.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            All content, branding, and materials on this platform are the property
            of the company or its licensors. You may not reproduce, distribute, or
            modify any content without explicit permission.
          </p>
        </section>

        <section>
          <h2>8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access if you
            violate any of these Terms. Termination does not exempt you from any
            outstanding obligations or liabilities.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            We are not liable for any indirect, incidental, or consequential
            damages resulting from the use or inability to use our services,
            including but not limited to loss of data or profits.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. The
            revised version will be effective upon posting. Continued use of our
            platform constitutes your acceptance of the changes.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact our support team at{" "}
            <a href="mailto:support@example.com">support@example.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
    
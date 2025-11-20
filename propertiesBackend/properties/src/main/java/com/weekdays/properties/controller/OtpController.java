package com.weekdays.properties.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    // ✅ SMSIndiaHub credentials
    private static final String API_KEY = "bGxMnkR7nUa3DpPDGdqhUg";
    private static final String SENDER_ID = "WDPROP";
    private static final String TEMPLATE_ID = "1007692442675920680";
    private static final String PE_ID = "1001053976927196733";
    private static final String SMS_URL = "https://cloud.smsindiahub.in/api/mt/SendSMS";

    // ✅ Store OTPs temporarily
    private final Map<String, OtpSession> otpStorage = new HashMap<>();

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ Step 1: Send OTP (for any phone number)
    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestParam String phone) {
        try {
            // 🔢 Generate OTP
            String otp = String.format("%06d", new Random().nextInt(1_000_000));
            otpStorage.put(phone, new OtpSession(otp, System.currentTimeMillis()));

            // 💬 Prepare message
            String message = URLEncoder.encode(
                    "Your OTP for verification with Weekdays Properties is " + otp +
                            ". Please do not share this code with anyone. It is valid for 10 minutes.",
                    StandardCharsets.UTF_8);

            // 🌐 Build request URL
            String smsUrl = UriComponentsBuilder.fromHttpUrl(SMS_URL)
                    .queryParam("APIKey", API_KEY)
                    .queryParam("senderid", SENDER_ID)
                    .queryParam("channel", "Trans")
                    .queryParam("DCS", "0")
                    .queryParam("flashsms", "0")
                    .queryParam("number", "91" + phone)
                    .queryParam("text", message)
                    .queryParam("DLTTemplateId", TEMPLATE_ID)
                    .queryParam("route", "0")
                    .queryParam("PEId", PE_ID)
                    .build(false)
                    .toUriString();

            // 🚀 Send SMS
            ResponseEntity<String> response = restTemplate.getForEntity(smsUrl, String.class);
            System.out.println("📩 SMSIndiaHub Response: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(Map.of(
                        "message", "✅ OTP sent successfully to " + phone,
                        "otp", otp // ⚠️ Optional: Remove this in production
                ));
            }

            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("❌ Failed to send OTP. Provider response: " + response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error while sending OTP: " + e.getMessage());
        }
    }

    // ✅ Step 2: Verify OTP
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestParam String phone, @RequestParam String otp) {
        OtpSession stored = otpStorage.get(phone);
        if (stored == null) {
            return ResponseEntity.badRequest().body("❌ OTP expired or not generated.");
        }

        long elapsed = System.currentTimeMillis() - stored.getTimestamp();
        if (elapsed > 10 * 60 * 1000) { 
            otpStorage.remove(phone);
            return ResponseEntity.badRequest().body("❌ OTP expired. Please request a new one.");
        }

        if (!stored.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("❌ Invalid OTP. Please try again.");
        }

        otpStorage.remove(phone);
        return ResponseEntity.ok("✅ OTP verified successfully!");
    }


    private static class OtpSession {
        private final String otp;
        private final long timestamp;

        public OtpSession(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }

        public String getOtp() {
            return otp;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
    
    
 // ✅ Step 3: Send any custom SMS message (Reusable)
    public ResponseEntity<String> sendCustomSms(String phone, String messageText) {
        try {
            // Encode message
            String encodedMessage = URLEncoder.encode(messageText, StandardCharsets.UTF_8);

            // Build request URL
            String smsUrl = UriComponentsBuilder.fromHttpUrl(SMS_URL)
                    .queryParam("APIKey", API_KEY)
                    .queryParam("senderid", SENDER_ID)
                    .queryParam("channel", "Trans")
                    .queryParam("DCS", "0")
                    .queryParam("flashsms", "0")
                    .queryParam("number", "91" + phone)
                    .queryParam("text", encodedMessage)
                    .queryParam("DLTTemplateId", TEMPLATE_ID)
                    .queryParam("route", "0")
                    .queryParam("PEId", PE_ID)
                    .build(false)
                    .toUriString();

            ResponseEntity<String> response = restTemplate.getForEntity(smsUrl, String.class);
            System.out.println("📩 Custom SMS Response: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok("✅ SMS sent successfully to " + phone);
            }

            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("❌ Failed to send SMS. Provider: " + response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("❌ Error sending SMS: " + e.getMessage());
        }
    }

    
}

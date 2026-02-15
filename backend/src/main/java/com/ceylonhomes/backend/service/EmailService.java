package com.ceylonhomes.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.ceylonhomes.backend.entity.Listing;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${admin.email:}")
    private String adminEmail;

    public void sendVerificationCode(String toEmail, String code, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("CeylonHomes - Password Reset Verification Code");
            message.setText(
                "Hello " + userName + ",\n\n" +
                "You requested to reset your password for CeylonHomes.\n\n" +
                "Your verification code is: " + code + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you didn't request this password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "CeylonHomes Team"
            );
            
            mailSender.send(message);
            log.info("✅ Verification email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            // In development mode, log the code to console if email fails
            log.error("❌ Failed to send email to: {}. Error: {}", toEmail, e.getMessage());
            log.warn("🔐 DEVELOPMENT MODE - Verification Code for {}: {}", toEmail, code);
            log.warn("⚠️ Please configure email settings in application.yml for production use");
            
            // Print to console for easy visibility
            System.out.println("\n" + "=".repeat(60));
            System.out.println("📧 EMAIL SENDING FAILED - DEVELOPMENT MODE");
            System.out.println("=".repeat(60));
            System.out.println("To: " + toEmail);
            System.out.println("User: " + userName);
            System.out.println("🔐 Verification Code: " + code);
            System.out.println("⏰ Valid for: 10 minutes");
            System.out.println("=".repeat(60) + "\n");
            
            // Don't throw exception in development mode - allow the flow to continue
            // throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendNewListingNotification(Listing listing) {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.warn("Admin email not configured; skipping new listing notification.");
            return;
        }

        try {
            String sellerName = listing.getOwner() != null && listing.getOwner().getName() != null
                ? listing.getOwner().getName()
                : "Unknown Seller";
            String sellerEmail = listing.getOwner() != null && listing.getOwner().getEmail() != null
                ? listing.getOwner().getEmail()
                : "Unknown Email";

            String subject = "CeylonHomes - New Listing Pending Approval (Seller: " + sellerName + ")";
            String textBody =
                "A new listing is pending approval.\n\n" +
                "Seller Name: " + sellerName + "\n" +
                "Seller Email: " + sellerEmail + "\n\n" +
                "Listing ID: " + listing.getId() + "\n" +
                "Title: " + listing.getTitle() + "\n" +
                "District: " + listing.getDistrict() + "\n" +
                "City: " + listing.getCity() + "\n" +
                "Price: " + listing.getPrice() + "\n\n" +
                "Please review this listing in the admin dashboard.";

            String htmlBody = buildListingEmailHtml(
                "New Listing Pending Approval",
                sellerName,
                sellerEmail,
                listing
            );

            sendHtmlEmail(adminEmail, subject, textBody, htmlBody);
            log.info("New listing notification sent to admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send admin listing notification to: {}. Error: {}", adminEmail, e.getMessage());
            // Don't fail the listing creation if email fails
        }
    }

    public void sendListingUpdatedNotification(Listing listing) {
        if (adminEmail == null || adminEmail.isBlank()) {
            log.warn("Admin email not configured; skipping listing update notification.");
            return;
        }
        if (listing == null) {
            log.warn("Listing is null; skipping listing update notification.");
            return;
        }

        try {
            String sellerName = listing.getOwner() != null && listing.getOwner().getName() != null
                ? listing.getOwner().getName()
                : "Unknown Seller";
            String sellerEmail = listing.getOwner() != null && listing.getOwner().getEmail() != null
                ? listing.getOwner().getEmail()
                : "Unknown Email";

            String subject = "CeylonHomes - Listing Updated (Seller: " + sellerName + ")";
            String textBody =
                "A listing was updated by a seller.\n\n" +
                "Seller Name: " + sellerName + "\n" +
                "Seller Email: " + sellerEmail + "\n\n" +
                "Listing ID: " + listing.getId() + "\n" +
                "Title: " + listing.getTitle() + "\n" +
                "Status: " + listing.getStatus() + "\n" +
                "District: " + listing.getDistrict() + "\n" +
                "City: " + listing.getCity() + "\n" +
                "Price: " + listing.getPrice() + "\n\n" +
                "Please review this listing in the admin dashboard.";

            String htmlBody = buildListingEmailHtml(
                "Listing Updated",
                sellerName,
                sellerEmail,
                listing
            );

            sendHtmlEmail(adminEmail, subject, textBody, htmlBody);
            log.info("Listing update notification sent to admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send listing update notification to: {}. Error: {}", adminEmail, e.getMessage());
            // Don't fail the listing update if email fails
        }
    }

    private void sendHtmlEmail(String toEmail, String subject, String textBody, String htmlBody)
            throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(textBody, htmlBody);
        mailSender.send(mimeMessage);
    }

    private String buildListingEmailHtml(String title, String sellerName, String sellerEmail, Listing listing) {
        String safeTitle = escapeHtml(title);
        String safeSellerName = escapeHtml(sellerName);
        String safeSellerEmail = escapeHtml(sellerEmail);
        String safeListingId = escapeHtml(String.valueOf(listing.getId()));
        String safeListingTitle = escapeHtml(listing.getTitle());
        String safeStatus = escapeHtml(String.valueOf(listing.getStatus()));
        String safeDistrict = escapeHtml(listing.getDistrict());
        String safeCity = escapeHtml(listing.getCity());
        String safePrice = escapeHtml(String.valueOf(listing.getPrice()));

        return ""
            + "<!doctype html>"
            + "<html>"
            + "<head>"
            + "  <meta charset=\"utf-8\"/>"
            + "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>"
            + "  <title>" + safeTitle + "</title>"
            + "</head>"
            + "<body style=\"margin:0;padding:0;background:#fefce8;font-family:Arial,Helvetica,sans-serif;color:#3f2d10;\">"
            + "  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#fefce8;padding:24px 0;\">"
            + "    <tr>"
            + "      <td align=\"center\">"
            + "        <table role=\"presentation\" width=\"600\" cellspacing=\"0\" cellpadding=\"0\" style=\"background:#ffffff;border-radius:12px;box-shadow:0 10px 24px rgba(113,63,18,0.15);overflow:hidden;border:1px solid #fde047;\">"
            + "          <tr>"
            + "            <td style=\"padding:22px 24px;background:linear-gradient(120deg,#713f12 0%,#a16207 55%,#ca8a04 100%);color:#ffffff;\">"
            + "              <div style=\"font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:#fef9c3;\">CeylonHomes</div>"
            + "              <div style=\"font-size:22px;font-weight:700;margin-top:6px;\">" + safeTitle + "</div>"
            + "            </td>"
            + "          </tr>"
            + "          <tr>"
            + "            <td style=\"padding:24px;\">"
            + "              <div style=\"font-size:15px;margin-bottom:16px;color:#3f2d10;\">A seller action needs your review.</div>"
            + "              <div style=\"background:#fef9c3;border-radius:10px;padding:14px 16px;margin-bottom:18px;border:1px solid #fde047;\">"
            + "                <div style=\"font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#a16207;margin-bottom:6px;\">Seller</div>"
            + "                <div style=\"font-size:16px;font-weight:700;color:#713f12;\">" + safeSellerName + "</div>"
            + "                <div style=\"font-size:13px;color:#854d0e;\">" + safeSellerEmail + "</div>"
            + "              </div>"
            + "              <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;\">"
            + "                <tr>"
            + "                  <td style=\"padding:8px 0;color:#a16207;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;\">Listing Details</td>"
            + "                </tr>"
            + "                <tr>"
            + "                  <td style=\"padding:6px 0;\"><strong style=\"color:#713f12;\">ID:</strong> " + safeListingId + "</td>"
            + "                </tr>"
            + "                <tr>"
            + "                  <td style=\"padding:6px 0;\"><strong style=\"color:#713f12;\">Title:</strong> " + safeListingTitle + "</td>"
            + "                </tr>"
            + "                <tr>"
            + "                  <td style=\"padding:6px 0;\"><strong style=\"color:#713f12;\">Status:</strong> " + safeStatus + "</td>"
            + "                </tr>"
            + "                <tr>"
            + "                  <td style=\"padding:6px 0;\"><strong style=\"color:#713f12;\">District:</strong> " + safeDistrict + "</td>"
            + "                </tr>"
            + "                <tr>"
            + "                  <td style=\"padding:6px 0;\"><strong style=\"color:#713f12;\">City:</strong> " + safeCity + "</td>"
            + "                </tr>"
            + "                <tr>"
            + "                  <td style=\"padding:6px 0;\"><strong style=\"color:#713f12;\">Price:</strong> " + safePrice + "</td>"
            + "                </tr>"
            + "              </table>"
            + "              <div style=\"margin-top:18px;font-size:14px;color:#854d0e;\">Please review this listing in the admin dashboard.</div>"
            + "            </td>"
            + "          </tr>"
            + "          <tr>"
            + "            <td style=\"padding:16px 24px;background:#fefce8;font-size:12px;color:#a16207;\">"
            + "              This is an automated notification from CeylonHomes."
            + "            </td>"
            + "          </tr>"
            + "        </table>"
            + "      </td>"
            + "    </tr>"
            + "  </table>"
            + "</body>"
            + "</html>";
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}

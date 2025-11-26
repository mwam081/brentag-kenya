// ContactFormServlet.java
package com.brentag.ke.servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
import java.util.logging.Logger;

@WebServlet("/contact")
@MultipartConfig(
    maxFileSize = 1024 * 1024 * 10, // 10MB
    maxRequestSize = 1024 * 1024 * 50, // 50MB
    fileSizeThreshold = 1024 * 1024 // 1MB
)
public class ContactFormServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = Logger.getLogger(ContactFormServlet.class.getName());
    
    // Email configuration
    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587";
    private static final String USERNAME = "your-email@gmail.com";
    private static final String PASSWORD = "your-app-password";
    private static final String TO_EMAIL = "info@brentag.co.ke";
    private static final String CC_EMAIL = "sales@brentag.co.ke";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        try {
            // Get form parameters
            String name = request.getParameter("name");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String company = request.getParameter("company");
            String subject = request.getParameter("subject");
            String message = request.getParameter("message");
            
            // Validate required fields
            if (name == null || name.trim().isEmpty() || 
                email == null || email.trim().isEmpty() || 
                subject == null || subject.trim().isEmpty() || 
                message == null || message.trim().isEmpty()) {
                
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\": false, \"message\": \"Please fill all required fields.\"}");
                return;
            }
            
            // Handle file upload
            Part filePart = request.getPart("upload");
            String fileName = null;
            File uploadedFile = null;
            
            if (filePart != null && filePart.getSize() > 0) {
                fileName = getFileName(filePart);
                
                // Create uploads directory if it doesn't exist
                String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                
                // Save the file
                uploadedFile = new File(uploadDir, System.currentTimeMillis() + "_" + fileName);
                filePart.write(uploadedFile.getAbsolutePath());
            }
            
            // Send email
            boolean emailSent = sendEmail(name, email, phone, company, subject, message, uploadedFile);
            
            // Clean up uploaded file
            if (uploadedFile != null && uploadedFile.exists()) {
                uploadedFile.delete();
            }
            
            if (emailSent) {
                response.setStatus(HttpServletResponse.SC_OK);
                out.print("{\"success\": true, \"message\": \"Thank you for your message. We will get back to you within 2 hours.\"}");
                
                // Log successful submission
                logger.info("Contact form submitted successfully: " + email);
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\": false, \"message\": \"Sorry, there was an error sending your message. Please try again later.\"}");
                
                // Log error
                logger.severe("Failed to send contact form email: " + email);
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"An unexpected error occurred. Please try again.\"}");
            
            // Log exception
            logger.severe("Contact form servlet error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
            out.close();
        }
    }
    
    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length() - 1);
            }
        }
        return "";
    }
    
    private boolean sendEmail(String name, String email, String phone, String company, 
                            String subject, String message, File attachment) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", SMTP_HOST);
            props.put("mail.smtp.port", SMTP_PORT);
            props.put("mail.smtp.ssl.trust", SMTP_HOST);
            
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(USERNAME, PASSWORD);
                }
            });
            
            Message emailMessage = new MimeMessage(session);
            emailMessage.setFrom(new InternetAddress(USERNAME, "Brentag Kenya Website"));
            emailMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(TO_EMAIL));
            emailMessage.setRecipients(Message.RecipientType.CC, InternetAddress.parse(CC_EMAIL));
            emailMessage.setSubject("New Contact Form: " + subject);
            emailMessage.setSentDate(new java.util.Date());
            
            // Create message body
            MimeBodyPart messageBodyPart = new MimeBodyPart();
            String emailContent = buildEmailContent(name, email, phone, company, subject, message);
            messageBodyPart.setContent(emailContent, "text/html; charset=utf-8");
            
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);
            
            // Add attachment if exists
            if (attachment != null && attachment.exists()) {
                MimeBodyPart attachmentBodyPart = new MimeBodyPart();
                attachmentBodyPart.attachFile(attachment);
                multipart.addBodyPart(attachmentBodyPart);
            }
            
            emailMessage.setContent(multipart);
            
            // Send email
            Transport.send(emailMessage);
            return true;
            
        } catch (Exception e) {
            logger.severe("Email sending failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    private String buildEmailContent(String name, String email, String phone, 
                                   String company, String subject, String message) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "<style>" +
               "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
               ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
               ".header { background: #0066cc; color: white; padding: 20px; text-align: center; }" +
               ".content { background: #f9f9f9; padding: 20px; }" +
               ".field { margin-bottom: 15px; }" +
               ".label { font-weight: bold; color: #0066cc; }" +
               ".footer { background: #333; color: white; padding: 10px; text-align: center; font-size: 12px; }" +
               "</style>" +
               "</head>" +
               "<body>" +
               "<div class='container'>" +
               "<div class='header'>" +
               "<h2>New Contact Form Submission</h2>" +
               "<p>Brentag Kenya Ltd</p>" +
               "</div>" +
               "<div class='content'>" +
               "<div class='field'><span class='label'>Name:</span> " + name + "</div>" +
               "<div class='field'><span class='label'>Email:</span> " + email + "</div>" +
               "<div class='field'><span class='label'>Phone:</span> " + (phone != null ? phone : "Not provided") + "</div>" +
               "<div class='field'><span class='label'>Company:</span> " + (company != null ? company : "Not provided") + "</div>" +
               "<div class='field'><span class='label'>Subject:</span> " + subject + "</div>" +
               "<div class='field'><span class='label'>Message:</span><br>" + message.replace("\n", "<br>") + "</div>" +
               "</div>" +
               "<div class='footer'>" +
               "<p>This email was sent from the Brentag Kenya Ltd website contact form.</p>" +
               "<p>Please respond within 2 hours during business hours.</p>" +
               "</div>" +
               "</div>" +
               "</body>" +
               "</html>";
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Redirect to contact page if accessed via GET
        response.sendRedirect("contact.html");
    }
}
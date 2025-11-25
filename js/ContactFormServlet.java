package com.brentag.ke.controller;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

@WebServlet("/contact")
@MultipartConfig(
    maxFileSize = 1024 * 1024 * 10, // 10MB
    maxRequestSize = 1024 * 1024 * 20 // 20MB
)
public class ContactFormServlet extends HttpServlet {
    
    private static final String COMPANY_EMAIL = "info@brentag.co.ke";
    private static final String COMPANY_NAME = "Brentag Kenya Ltd";
    
    @Override
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
            if (filePart != null && filePart.getSize() > 0) {
                fileName = extractFileName(filePart);
                // Save file to server (implement as needed)
                // saveUploadedFile(filePart);
            }
            
            // Send email notification
            boolean emailSent = sendEmailNotification(name, email, phone, company, subject, message, fileName);
            
            // Save to database (implement as needed)
            // saveToDatabase(name, email, phone, company, subject, message, fileName);
            
            if (emailSent) {
                response.setStatus(HttpServletResponse.SC_OK);
                out.print("{\"success\": true, \"message\": \"Thank you for your message. We will get back to you soon!\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\": false, \"message\": \"Failed to send message. Please try again later.\"}");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"message\": \"An error occurred. Please try again.\"}");
        }
    }
    
    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("filename")) {
                return s.substring(s.indexOf("=") + 2, s.length() - 1);
            }
        }
        return "";
    }
    
    private boolean sendEmailNotification(String name, String email, String phone, 
                                        String company, String subject, String message, 
                                        String fileName) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", "your-smtp-host");
            props.put("mail.smtp.port", "587");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication("your-email@brentag.co.ke", "your-password");
                }
            });
            
            Message emailMessage = new MimeMessage(session);
            emailMessage.setFrom(new InternetAddress(COMPANY_EMAIL, COMPANY_NAME));
            emailMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(COMPANY_EMAIL));
            emailMessage.setSubject("New Contact Form Submission: " + subject);
            
            // Create email content
            String emailContent = buildEmailContent(name, email, phone, company, subject, message);
            emailMessage.setContent(emailContent, "text/html; charset=utf-8");
            
            Transport.send(emailMessage);
            return true;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private String buildEmailContent(String name, String email, String phone, 
                                   String company, String subject, String message) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head><style>body{font-family:Arial,sans-serif}</style></head>" +
               "<body>" +
               "<h2>New Contact Form Submission</h2>" +
               "<table border='0' cellpadding='5' cellspacing='0'>" +
               "<tr><td><strong>Name:</strong></td><td>" + name + "</td></tr>" +
               "<tr><td><strong>Email:</strong></td><td>" + email + "</td></tr>" +
               "<tr><td><strong>Phone:</strong></td><td>" + (phone != null ? phone : "Not provided") + "</td></tr>" +
               "<tr><td><strong>Company:</strong></td><td>" + (company != null ? company : "Not provided") + "</td></tr>" +
               "<tr><td><strong>Subject:</strong></td><td>" + subject + "</td></tr>" +
               "<tr><td><strong>Message:</strong></td><td>" + message.replace("\n", "<br>") + "</td></tr>" +
               "</table>" +
               "</body>" +
               "</html>";
    }
}
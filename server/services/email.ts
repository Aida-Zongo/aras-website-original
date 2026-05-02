
import nodemailer from "nodemailer";

// Simple transport configuration using environment variables
// Use standard SMTP variables or a custom one
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-mail.outlook.com", // Default for live/outlook
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for others
    auth: {
        user: process.env.SMTP_USER, // source_kdg@live.fr
        pass: process.env.SMTP_PASS, // Password
    },
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("[Email] Not sending email - Credentials missing in .env");
        throw new Error("Credentials missing"); // Throw so UI knows it failed
    }

    const mailOptions = {
        from: `"L'équipe ARAS" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: html || text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("[Email] Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("[Email] Error sending email:", error);
        throw error;
    }
}

export async function sendAdhesionEmail(
    to: string,
    firstName: string,
    status: "approved" | "rejected"
) {
    const contactEmail = "source_kdg@live.fr";
    const websiteUrl = process.env.VITE_PUBLIC_URL || "https://aras.bf";

    let subject = "";
    let text = "";

    if (status === "approved") {
        subject = "🎉 Adhésion ARAS - Approuvée";
        text = `Bonjour ${firstName},\n\nVotre demande d'adhésion à ARAS a été approuvée !\n\nBienvenue parmi nous.\n\nCordialement,\nL'équipe ARAS`;
    } else {
        subject = "Adhésion ARAS - Mise à jour";
        // Using the specific text requested by user
        text = `Bonjour ${firstName},\n\nVotre demande d'adhésion à ARAS n'a pas pu être retenue pour le moment.\n\nPour toute information supplémentaire, vous pouvez nous contacter sur :\n${contactEmail}\n\nCordialement,\nL'équipe ARAS`;
    }

    return sendEmail({ to, subject, text });
}

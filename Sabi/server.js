import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// WhatsApp configuration
const WHATSAPP_API_URL = 'https://api.whatsapp.com/send';
const YOUR_WHATSAPP_NUMBER = 'YOUR_WHATSAPP_NUMBER'; // Format: 2348123456789 (Nigeria example)
const ADMIN_PHONE_NUMBER = 'ADMIN_PHONE_NUMBER'; // Your phone number to receive notifications

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/register', async (req, res) => {
    try {
        const { childName, childAge, parentEmail, parentPhone, courseCategory, paymentReference } = req.body;
        
        // Format the message for WhatsApp
        const message = `New Registration!\n\n*Child Name:* ${childName}\n*Age:* ${childAge}\n*Parent Email:* ${parentEmail}\n*Parent Phone:* ${parentPhone}\n*Course:* ${courseCategory}\n*Payment Reference:* ${paymentReference}`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp link
        const whatsappLink = `${WHATSAPP_API_URL}?phone=${ADMIN_PHONE_NUMBER}&text=${encodedMessage}`;
        
        // Send to your WhatsApp (this is just the link, actual sending would require user interaction or WhatsApp Business API)
        // For actual sending, you would need to use WhatsApp Business API
        
        res.json({ 
            success: true,
            whatsappLink: whatsappLink,
            message: "Registration data prepared for WhatsApp"
        });
        
    } catch (error) {
        console.error('Error processing registration:', error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
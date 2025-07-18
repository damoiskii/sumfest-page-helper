const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// CORS middleware to allow requests from your frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    next();
});

// Function to check if register button exists
async function checkRegisterButton() {
    let browser = null;
    try {
        // Launch browser in headless mode for API with Alpine Linux compatibility
        // Use system chromium for better Alpine compatibility
        const executablePath = '/usr/bin/chromium-browser';
        
        browser = await chromium.launch({ 
            headless: true,
            executablePath: executablePath,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });
        const page = await browser.newPage();

        // Navigate to the page
        await page.goto('https://event.memzo.ai/m/reggae-sumfest/18088');
        
        // Wait for the page to fully load
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Try to find the register button
        const registerLink = await page.$('a[href="pre-register/18088"]');
        
        const result = {
            registerButtonExists: !!registerLink,
            timestamp: new Date().toISOString(),
            pageTitle: await page.title()
        };

        if (registerLink) {
            // Get additional info about the button if it exists
            const text = await registerLink.textContent();
            const classes = await registerLink.getAttribute('class');
            result.buttonText = text?.trim();
            result.buttonClasses = classes;
        }

        return result;

    } catch (error) {
        throw new Error(`Failed to check register button: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// API endpoint to check register button
app.get('/api/check-register-button', async (req, res) => {
    try {
        console.log('🔍 Checking for register button...');
        const result = await checkRegisterButton();
        
        console.log(`✅ Register button exists: ${result.registerButtonExists}`);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('❌ Error checking register button:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Simple endpoint that returns just true/false
app.get('/api/register-button-exists', async (req, res) => {
    try {
        const result = await checkRegisterButton();
        res.json(result.registerButtonExists);
    } catch (error) {
        console.error('❌ Error checking register button:', error.message);
        res.status(500).json(false);
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Register Button Checker API'
    });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Register Button Checker API',
        endpoints: {
            'GET /api/health': 'Health check',
            'GET /api/check-register-button': 'Detailed check with metadata',
            'GET /api/register-button-exists': 'Simple true/false response'
        },
        example: {
            url: `http://localhost:${PORT}/api/register-button-exists`,
            response: 'true or false'
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Register Button Checker API running on http://localhost:${PORT}`);
    console.log(`📍 Main endpoint: http://localhost:${PORT}/api/register-button-exists`);
    console.log(`📋 Detailed endpoint: http://localhost:${PORT}/api/check-register-button`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 Shutting down gracefully...');
    process.exit(0);
});

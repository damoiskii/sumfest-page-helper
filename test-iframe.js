const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: false }); // or true for headless
    const page = await browser.newPage();

    // Point to your local HTML file
    const htmlPath = path.join(__dirname, 'index.html');
    await page.goto(`https://event.memzo.ai/m/reggae-sumfest/18088`);

    console.log('🔄 Page loaded, waiting for content to load...');
    
    // Wait for the page to fully load and any dynamic content
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any JavaScript to execute
    await page.waitForTimeout(3000);

    console.log('🔍 Looking for register link...');

    // Try to find the REGISTER link directly on the page
    try {
        // First, let's see the page title and some basic info
        const title = await page.title();
        console.log(`📄 Page title: "${title}"`);
        
        // Check if there are any elements at all
        const allElements = await page.$$('*');
        console.log(`🔢 Total elements on page: ${allElements.length}`);
        
        const registerLink = await page.$('a[href="pre-register/18088"]');

        if (registerLink) {
            console.log('✅ REGISTER link is present on the page!');
            const text = await registerLink.textContent();
            const classes = await registerLink.getAttribute('class');
            console.log(`📝 Link text: "${text}"`);
            console.log(`🎨 Link classes: "${classes}"`);
        } else {
            console.log('❌ REGISTER link not found on the page.');
            
            // Let's try to see what links are actually present
            console.log('🔍 Looking for all links on the page...');
            const allLinks = await page.$$('a');
            console.log(`Found ${allLinks.length} links on the page`);
            
            // Also try looking for any elements with "register" text
            const registerElements = await page.$$('*:has-text("REGISTER")');
            console.log(`Found ${registerElements.length} elements containing "REGISTER" text`);
            
            for (let i = 0; i < Math.min(allLinks.length, 10); i++) {
                const href = await allLinks[i].getAttribute('href');
                const text = await allLinks[i].textContent();
                console.log(`Link ${i + 1}: href="${href}" text="${text?.trim()}"`);
            }
        }
    } 
    catch (error) {
        console.log('❌ Error accessing page content:', error.message);
    }

    // Wait a bit before closing so you can see the browser
    console.log('⏳ Waiting 5 seconds before closing browser...');
    await page.waitForTimeout(5000);

    await browser.close();
})();

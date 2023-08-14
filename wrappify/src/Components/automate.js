const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function addUserToSpotify(userEmail, userId) {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    try {
        // Navigate to Spotify's User Management page
        await driver.get('https://developer.spotify.com/user-management-url'); // Replace with the actual URL

        // Login if necessary
        await driver.findElement(By.id('loginEmail')).sendKeys('YOUR_SPOTIFY_DEV_EMAIL'); // Replace selector if needed
        await driver.findElement(By.id('loginPassword')).sendKeys('YOUR_SPOTIFY_DEV_PASSWORD'); // Replace selector if needed
        await driver.findElement(By.id('loginButton')).click(); // Replace selector if needed

        // Assuming you've logged in, navigate or interact to add a user
        await driver.findElement(By.id('addUserButton')).click(); // Replace selector if needed

        // Input the user email and userId
        await driver.findElement(By.id('userEmailInput')).sendKeys(userEmail); // Replace selector if needed
        await driver.findElement(By.id('userIdInput')).sendKeys(userId); // Replace selector if needed

        // Submit the form
        await driver.findElement(By.id('submitButton')).click(); // Replace selector if needed

        // Optionally, check for successful submission
        let successMessage = await driver.findElement(By.id('successMessage')).getText(); // Replace selector if needed

        return successMessage.includes('successfully added'); // Modify based on the actual success message
    } catch (error) {
        console.error('Error in Selenium automation:', error);
        throw error;
    } finally {
        await driver.quit();
    }
}

module.exports = addUserToSpotify;

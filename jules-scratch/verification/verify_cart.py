import subprocess
import time
from playwright.sync_api import sync_playwright, expect

def run_verification():
    # Start the server as a subprocess
    server_process = subprocess.Popen(['node', 'index.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(2)  # Give the server a moment to start

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            # Navigate to the page
            page.goto('http://localhost:3000')

            # Expect the h1 to be visible
            expect(page.locator('h1')).to_be_visible()

            # Click the "Add to Cart" button for the first product
            first_product_button = page.locator('.product button').first
            first_product_button.click()

            # Expect the cart total to be updated
            cart_total = page.locator('#cart-total')
            expect(cart_total).to_have_text('499.99')

            # Take a screenshot
            page.screenshot(path='jules-scratch/verification/cart_verification.png')

            browser.close()
    finally:
        # Stop the server
        server_process.terminate()

if __name__ == '__main__':
    run_verification()

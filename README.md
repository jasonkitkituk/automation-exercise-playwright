# automation-exercise-playwright
Automation Exercise for QA


Q1. Can you review the website and pick six most important user journeys from the site?
   1. User Registration & Account Deletion
   2. User Login & Logout
   3. Product Search & Filtering
   4. Complete Checkout Flow / Place Order
   5. Cart Management & Quantity Verification
   6. Contact Us Form Submission

Q2. Out of the six user journeys proceed to pick four journeys to script against and explain why you picked these journeys?
   1. User Registration & Account Deletion
      - Account registration is the mose critical process for online shopping. When script against need to validate the registration form (including multi-level inputs, dropdowns, and checkboxes) and execute "Delete Account" at the end to ensure test repeatability.
   
   2. User Login & Logout
      - High-frequency basic functions: Authentication is a prerequisite for most operations, and writing it as a standalone script can serve as the foundation for other tests especially for "Checkout Flow" and "Place Order. Check if any data corruption or errors occur when multiple users log in simultaneously?
   
   3. Product Search & Filering
      - Core browsing logic: Validate that dynamic DOM rendering accurately matches search results with query keywords as a core Smoke Test priority.
   
   4. Place Order and Check out while account logged
      - The Core Flow which directly related to revenue. It covers the status transmission across multiple pages, including shopping cart, address confirmation, and credit card payment, and is the most valuable test case in regression testing.

Q3. Proceed to choose the framework and programming language you intend on using and explain why you choose them? 
   - Programming Language: TypeScript
   - Test Automation Framework: Playwright
      - Playwright provides a built-in Auto-waiting Mechanism which significantly reducing timing bugs and flakiness common in traditional Selenium/Cypress.
      - TypeScript provides excellent type checking and auto-complete, reducing syntax errors and improving maintainability when writing Page Objects.
      - Combined with TypeScript's static type constraints and Page Object Model, when website UI elements change, engineers only need to modify the Locator in the Page Class; the test script itself remains completely unchanged, greatly reducing long-term maintenance costs.
      - Playwright provides Comprehensive Debugging Tools which includes Trace Viewer, Codegen, and HTML Reporter, allowing for rapid recording and reproduction of issues when tests fail.

Q4. Build a basic framework from scratch and script the four journeys you have chosen previously.
   - Known Issues & Stability Considerations:
     - Note on Test Execution: automationexercise.com frequently experiences high server latency and dynamic third-party ad overlays. To mitigate test flakiness, the framework utilizes domcontentloaded strategies, { force: true } click actions, and configured retry mechanisms in playwright.config.ts.


Other Issues:
- Email formation validation not correct (Subscription) and No validation (Contact Us)
- "Add to cart" accept "0" or huge amount of quantity

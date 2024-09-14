# NobleChairs Tool

### A Chrome/Edge extension for efficiently copying and pasting user data into Shipstream, with added functionalities such as telephone number disguise.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation Guide](#installation-guide)
4. [Usage Instructions](#usage-instructions)
5. [Extension Features Explained](#extension-features-explained)
6. [Customization](#customization)
7. [Known Issues](#known-issues)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

The **NobleChairs Tools** Chrome extension is a powerful utility designed for the employees of Caseking and the Pro Gamersware to streamline data entry. This tool allows for easy copying of customer data from platforms such as Zendesk and then pasting it into specific forms on Shipstream. Additionally, it includes the ability to disguise phone numbers when required.

---

## Features

- **Copy Customer Data**: Extract data like name, address, email, phone number, and ticket ID from a Zendesk ticket or other platforms.
- **Paste Customer Data**: Automatically fill in forms on Caseking's website with the copied data.
- **Telephone Disguise**: Replace the customer's actual phone number with a default number (`0123456789`) when required.
- **Custom Toggle Switch**: Easily switch between real and disguised phone numbers using a sleek toggle button. (required for DACH countries)
- **Easy Integration**: Automatically detects and works with Caseking-related tabs.

---

## Installation Guide

### Prerequisites
- **Google Chrome**: This extension is designed specifically for the Google Chrome browser.
- **Google Edge**: This extension is designed specifically for the Google Edge browser.
- **Developer Mode**: Since the extension is not yet published in the Chrome Web Store, it needs to be loaded manually using Developer Mode.

### Steps for Installing the Extension

1. **Download the Extension Code**:
   - Clone the repository or download the `.zip` file from the repository and extract it.

2. **Open Chrome/Edge**:
   - Open Google Chrome/Edge on your computer.

3. **Go to Chrome/Edge Extensions**:
   - Type `chrome://extensions/` or `edge://extensions` into the address bar and hit Enter.

4. **Enable Developer Mode**:
   - In the top-right corner, toggle the switch labeled **Developer mode**.

5. **Load the Unpacked Extension**:
   - Click on the **Load unpacked** button.
   - Browse to the directory where you downloaded or extracted the extension and select it.

6. **Verify the Extension**:
   - You should now see the **NobleChairs Tool** extension icon in your Chrome toolbar.

---

## Usage Instructions

### Step 1: Copy Data

1. **Navigate to the Ticket**:
   - Go to the Zendesk ticket page from which you want to extract user data.
   
2. **Click on the Extension Icon**:
   - Click on the **NobleChairs Tool** extension icon in your browser toolbar to open the popup.

3. **Click "Copy Data"**:
   - Click the **Copy Data** button in the popup. The extension will extract the following details:
     - First Name
     - Last Name
     - Address (Street and House Number)
     - City
     - Postal Code
     - Email
     - Phone Number
     - Ticket ID

### Step 2: Paste Data

1. **Navigate to the Shipstream Form**:
   - Open the Caseking order system *(Shipstream)*.

2. **Click on the Extension Icon**:
   - Open the **NobleChairs Tool** popup again.

3. **Click "Paste Data"**:
   - Click the **Paste Data** button to automatically populate the form fields with the data extracted earlier.

4. **Change the Country**
   - Change the country to which the product is to be shipped.

### Step 3: Toggle the Phone Number

1. **Disguise Telephone**:
   - Use the **Telephone Disguise** toggle switch to either input the real phone number or replace it with a default phone number (`0123456789`).
   - When the switch is in the "ON" position, the phone number will be set to the default `0123456789`.
   - When the switch is in the "OFF" position, the original phone number will be used.

---

## Extension Features Explained

### 1. **Copy Data Functionality**:
   - This feature uses the extension to extract the relevant user data from Zendesk or other supported platforms. It captures details such as name, address, and ticket ID using regular expressions to match specific patterns in the page content.
   
### 2. **Paste Data Functionality**:
   - The extension detects if you're on the Caseking platform and automatically populates the form fields based on the previously copied data.
   - The system automatically maps the copied data to form fields such as `order-shipping_address_firstname`, `order-shipping_address_lastname`, `order-shipping_address_street0`, `order-shipping_address_city`, `order-shipping_address_postcode`, `order-shipping_address_email`, and `order-shipping_address_telephone`.

### 3. **Telephone Disguise**:
   - This toggle feature allows you to hide the customer's real phone number by replacing it with a default number (`0123456789`), which is useful in cases where phone privacy is required.
   - By default, the phone number will be copied and pasted, but this can be switched with a simple toggle button to disguise it.

---

## Customization

The extension can be customized to fit your needs by modifying the following:

1. **Data Extraction Patterns**:
   - If you need to extract different or additional fields, you can modify the regular expressions in the `popup.js` file.
   
2. **Phone Number Disguise**:
   - The default number for phone number disguise (`0123456789`) can be changed in the `popup.js` file if needed.

3. **Styling**:
   - The look and feel of the popup can be adjusted by modifying the CSS in the `popup.html` file. The current design is inspired by **Caseking's** branding, but you can customize it further.

---

## Known Issues

1. **Compatibility**:
   - The extension is designed for use with the Chrome browser and may not work with other browsers.
   
2. **Form Field Detection**:
   - The extension assumes specific form field IDs on the Zendesk and Shipstream platform. If these IDs change, the extension may need to be updated.

3. **Platform Compatibility**:
   - The extension is designed to extract data from platforms like Zendesk. If you need it to work with other platforms, adjustments will be needed to the extraction logic.

---

## Contributing

If you'd like to contribute to the development of this extension, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

By following this `README`, you will be able to install, use, and contribute to the **Caseking Tools** extension, ensuring smooth workflows for your team at Caseking.

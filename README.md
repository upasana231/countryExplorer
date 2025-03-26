# 🌍 Responsive Web Design Project

## 📜 Overview

Welcome to the **Responsive Web Design Project**! This project showcases a list of countries in a beautifully responsive layout, adapting seamlessly across different screen sizes—mobile, tablet, and desktop. Using media queries, the layout adjusts dynamically, ensuring a user-friendly experience on any device. 🇺🇳🌎



## 📝 Project Overview

This project is a **responsive website** that displays **country cards**. It showcases how to make a layout adapt to different screen sizes using CSS, including the use of **media queries** for responsiveness. The layout includes a **Favorites Section** that remains accessible at all times, and detailed views of countries displayed in a popup format. The project is designed to provide a seamless user experience across devices, whether viewed on large desktop screens or smaller mobile screens.

## 🔧 Features

1. **Responsive Layout:**
   - The layout automatically adjusts based on the screen size, ensuring that users have an optimal viewing experience across a variety of devices, such as desktops, tablets, and smartphones.
   - On larger screens (e.g., desktops), **3 country cards** are displayed per row.
   - On medium-sized screens (e.g., tablets), **2 country cards** are displayed per row.
   - On smaller screens (e.g., smartphones), only **1 country card** is displayed per row, ensuring that the content remains easily readable.
   - The **Favorites Section** is always accessible, positioned at the bottom of the screen on mobile devices for easy access.

2. **Country Cards:**
   - Each country card contains basic information about the country, and users can interact with these cards to view detailed information in a popup.
   - The layout of the country cards adjusts based on screen size, ensuring the site remains user-friendly.

3. **Popup for Country Details:**
   - Clicking on any country card opens a popup displaying more detailed information about the selected country.
   - The popup content includes details such as country name, flag, population, capital city, and other relevant information.
   - The popup is designed to be responsive, ensuring it fits properly on screens of all sizes.

4. **Favorites Section:**
   - The **Favorites Section** allows users to save their favorite countries for quick access.
   - On larger screens, this section remains at the side of the page.
   - On smaller screens, it is positioned at the bottom of the screen for easy access while keeping the user interface clean and minimal.

5. **Interactive UI:**
   - Buttons are provided to add countries to favorites, and users can remove countries from the favorites list.
   - Interactive buttons are styled to change appearance when hovered over, providing a visually appealing and intuitive experience.
   - This section is always visible on mobile devices for ease of use.
## 2. Usage Instructions

### Country Cards Layout:
- The country cards are displayed in a **grid layout**. Depending on the screen size, the number of cards per row adjusts automatically:
  - On **large screens**: 3 cards per row.
  - On **medium screens**: 2 cards per row.
  - On **small screens**: 1 card per row.
- Each card shows a **country flag** and basic information like the country's **name**, **capital**, and **population**.

### Favorites Section:
- The **Favorites Section** is located at the **bottom of the screen** on mobile devices and stays in place while users scroll.
- On **desktop or tablet-sized screens**, it is positioned on the side of the screen.
- Users can click a **star button** on the country cards to add them to their favorites list.
- The Favorites Section will dynamically update with the countries the user has added.

### Popup for Country Details:
- When you click on any **country card**, a **popup** will appear displaying more detailed information about the country.
- Information might include: **Country name**, **Capital**, **Population**, **Flag**, **Languages**, and **Timezones**.
- You can **close the popup** by clicking on the close button.

### Data Fetching:
- The project fetches country data from the **Country Layer API**. This API provides up-to-date information about various countries such as name, capital, population, and more.
- If the API request fails or is unavailable, the project falls back to using a **local JSON file** as a backup data source.
- If data is missing or unavailable from either the API or the JSON file, it will display **"N/A"** in the respective fields.

---

## 🛠️ Technologies Used
- **HTML**: The structure and layout of the web pages.
- **CSS**: Styling and responsiveness of the layout using media queries.
- **JavaScript** (optional): For dynamic content like adding/removing items from the Favorites Section.
- **RestCountry API**: Fetches live country data (used with fallback to a JSON file).

---


## 🤝 Contributing
Contributions to this project are always welcome! If you'd like to improve or add new features, feel free to fork the repository, make your changes, and submit a **pull request**. Please ensure that your changes maintain the **responsiveness** and **mobile-first design** of the layout.

---



## 🌟 Acknowledgements
- **Responsive Web Design**: The project emphasizes the importance of making websites accessible across all devices. The layout uses **media queries** to create an adaptive and seamless experience for users, regardless of their screen size.
- **CSS Media Queries**: These are crucial in ensuring the design adjusts properly for different devices.
- **Open-Source Community**: Many of the resources and inspirations for this project come from the vast **open-source community**, which provides tools and frameworks for creating high-quality web applications.

<!-- 
  Project: News Headlines Reader
  Purpose: A React-based news aggregator using the GNews API.
  Main Entry Point: src/main.jsx
  Root Component: src/App.jsx
-->

# 🧩 News Headlines Reader

A modern React-based news application that fetches and displays the latest headlines using a news API. This project demonstrates state management with hooks, asynchronous API handling, and responsive UI design.

---

## 🚀 Features

- 📰 **Fetch latest news headlines**: Real-time data from GNews API.
- 📂 **Filter news by category**: Navigate through Technology, Sports, Business, etc.
- 🔍 **Search articles**: Filter headlines by keyword in real-time.
- 📖 **Expandable descriptions**: View more details and estimated reading time.
- ✅ **Read History**: Mark articles as read to keep track of your progress.
- 🔖 **Bookmarks**: Save your favorite articles for later.
- 🌗 **Dark Mode**: Seamless theme switching for better readability.
- 🔄 **Smart Caching**: 10-minute cache to optimize API quota usage.

---

## 🛠️ Tech Stack

<!-- 
  Tech Stack Keywords:
  - React 19: UI library
  - Vite: Build tool
  - Lucide React: Icon library
  - Date-fns: Date formatting
-->

- **React (Vite)**: Modern frontend development environment.
- **JavaScript (ES6+)**: Features like async/await, destructing, and spread operators.
- **Vanilla CSS**: Custom styling with CSS variables and flex/grid layouts.
- **Lucide React**: Beautiful, consistent icons.
- **GNews API**: High-quality global news source.

---

## 📦 Installation & Setup

<!-- 
  Syntax Note: Bash commands used for environment setup.
-->

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AryanMoorthy/NewsReader.git
   cd NewsReader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_NEWS_API_KEY=your_gnews_api_key_here
   ```

4. **Run the app locally**:
   ```bash
   npm run dev
   ```

---

## 📌 Project Structure

<!-- 
  Logic: Modular architecture for better maintainability.
-->

- `index.html`: The root HTML file.
- `src/main.jsx`: The JavaScript entry point.
- `src/App.jsx`: The application's "brain" (state and logic).
- `src/components/`: Modular UI components (Header, ArticleCard, etc.).
- `src/utils/constants.js`: Centralized data and settings.
- `src/index.css`: Global design system and themes.

---

## 🙌 Future Improvements

- [ ] Pagination or Infinite Scroll.
- [ ] Multiple news source integrations.
- [ ] Push notifications for breaking news.

---

## 👨‍💻 Author

**Aryan Moorthy**
- Full-stack developer in training.
- News enthusiast and React fan.
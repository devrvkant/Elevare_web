# 🚀 Elevare

> **Elevate Your Career with AI-Powered Guidance**

Elevare is a full-stack web application that leverages artificial intelligence to help users predict career paths, generate personalized learning roadmaps, and access curated AI tools. Built with modern technologies, Elevare provides an intuitive dashboard for career development and skill enhancement.

---

## ✨ Features

- 🎯 **AI Career Prediction** - Get personalized career recommendations based on your skills and interests
- 🗺️ **Smart Roadmap Generation** - Create customized learning paths with AI assistance
- 🛠️ **AI Tools Hub** - Access a curated collection of AI-powered productivity tools
- 📊 **History Tracking** - Keep track of your career predictions and roadmaps
- 🔐 **Secure Authentication** - User authentication powered by Clerk
- 📱 **Responsive Design** - Seamless experience across all devices
- 🎨 **Modern UI/UX** - Beautiful interface built with Tailwind CSS and Radix UI

---

## 🏗️ Project Structure

```
web/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   ├── ui/         # Base UI components (shadcn/ui)
│   │   │   └── routes/     # Route guards and protections
│   │   ├── pages/       # Page components
│   │   ├── features/    # Redux features (slices & API)
│   │   ├── redux/       # Redux store configuration
│   │   ├── layouts/     # Layout components
│   │   ├── config/      # Configuration files
│   │   └── lib/         # Utility functions
│   └── public/          # Static assets
│
└── server/              # Backend Node.js application
    └── src/
        ├── controllers/ # Route controllers
        ├── routes/      # API routes
        ├── models/      # MongoDB models
        ├── config/      # Server configuration
        └── lib/         # Database connection & utilities
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.6
- **Routing:** React Router 7.9.1
- **State Management:** Redux Toolkit 2.10.1
- **Styling:** Tailwind CSS 4.1.13
- **UI Components:** Radix UI
- **Authentication:** Clerk
- **Icons:** Lucide React
- **Markdown:** React Markdown
- **Flow Diagrams:** XY Flow

### Backend

- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** MongoDB with Mongoose 8.19.3
- **AI Integration:** Google Generative AI
- **HTTP Client:** Axios
- **Environment:** dotenv

### Development Tools

- **Linting:** ESLint 9.35.0
- **Dev Server:** Nodemon
- **Version Control:** Git

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Clerk account for authentication
- Google Generative AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/devrvkant/Elevare_web.git
   cd Elevare_web
   ```

2. **Install dependencies**

   **Client:**

   ```bash
   cd client
   npm install
   ```

   **Server:**

   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**

   **Client `.env`:**

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_BASE_URL=http://localhost:5500
   ```

   **Server `.env`:**

   ```env
   PORT=5500
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the application**

   **Development Mode:**

   Terminal 1 (Client):

   ```bash
   cd client
   npm run dev
   ```

   Terminal 2 (Server):

   ```bash
   cd server
   npm run dev
   ```

   **Production Build:**

   Client:

   ```bash
   cd client
   npm run build
   npm run preview
   ```

   Server:

   ```bash
   cd server
   npm start
   ```

---

## 📡 API Endpoints

### Career Prediction

- `POST /api/career/predict` - Generate AI-powered career predictions
- `GET /api/career/history` - Retrieve user's career prediction history

### Roadmap Generation

- `POST /api/roadmap/generate` - Create personalized learning roadmaps
- `GET /api/roadmap/all` - Get all user roadmaps
- `GET /api/roadmap/:id` - Get specific roadmap details

---

## 🎨 Key Features Breakdown

### 1. Dashboard

The main hub featuring:

- Welcome hero section with quick actions
- AI tools showcase
- Recent history of predictions and roadmaps

### 2. Career Prediction

- AI-powered career path analysis
- Personalized recommendations based on skills
- Interactive modal with detailed insights

### 3. Roadmap Generator

- Visual roadmap creation using flow diagrams
- Step-by-step learning paths
- Customizable milestones and resources

### 4. AI Tools Hub

- Curated collection of AI productivity tools
- Categorized tool cards
- Direct links to external AI services

### 5. History Page

- Track all your career predictions
- Access saved roadmaps
- Organize your learning journey

---

## 🔒 Security

- Environment variables for sensitive data
- Secure authentication via Clerk
- CORS configuration for API protection
- `.env` files excluded from version control

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Ravikant Jangir**

- GitHub: [@devrvkant](https://github.com/devrvkant)
- Website: [jangir.me](https://elevare.jangir.me)

---

## 🙏 Acknowledgments

- Google Generative AI for powering the AI features
- Clerk for seamless authentication
- shadcn/ui for beautiful UI components
- The open-source community

---

## 📧 Support

For support, email support@jangir.me or open an issue in the GitHub repository.

---

<div align="center">
  <p>Made with ❤️ by Ravikant Jangir</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>

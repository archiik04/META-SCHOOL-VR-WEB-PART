# META-SCHOOL-VR 🎓
LIVE DEMO: https://smart-board-metaverse.vercel.app

DEMO VIDEO : https://www.youtube.com/watch?v=SNPmQ05y8TQ

> An AI-powered immersive learning platform combining Generative AI with Metaverse technology to revolutionize education through interactive VR experiences.

**Built by Team CheatCode**

---

## 🚀 Overview

META-SCHOOL-VR addresses the declining attention spans (< 15 seconds) of modern learners by creating an immersive, AI-driven educational environment. We've combined cutting-edge VR technology with generative AI to transform passive learning into active, visual, and engaging experiences.

### Key Problem Statement
- Traditional ed-tech platforms focus on content delivery, not comprehension
- Students still rely on rote memorization over conceptual understanding
- Declining engagement due to passive learning methods
- Educational inequality between different socioeconomic groups

### Our Solution
An immersive metaverse learning platform with AI-powered features that standardizes quality education and supports 65+ languages for global accessibility.

---

## ✨ Core Features

### 🤖 AI-Powered Components
- **Multilingual AI Teacher**: Real-time instruction in 65+ languages
- **AI-Generated Video Lessons**: Dynamic content creation tailored to learning pace
- **Spatial 3D AI Audiobooks**: Immersive audio learning experiences
- **AI-Powered Smart Board**: Interactive teaching tools with real-time AI assistance
- **Student Analytics Tracker**: ML-driven performance monitoring and personalized recommendations

### 🎮 Interactive Learning
- **Gamified Learning**: 6 AI-powered educational mind games
- **3D Animated Lessons**: Visual representations of complex concepts
- **AI Metaverse**: Historical site recreations (Charminar, Puri Jagannath, etc.)
- **Virtual Classrooms**: Collaborative learning spaces with global accessibility

---

## 🛠️ Tech Stack

### VR/3D Experience Layer
```
Unity (Game Engine)
Blender (3D Modeling & Animation)
XR Interaction Toolkit (VR Interactions)
ConvAI (Conversational AI Integration)
```

### Web Application Layer
```
React 18+ (Frontend Framework)
TypeScript (Type Safety)
JavaScript (ES6+)
HTML5 (Markup)
Tailwind CSS (Styling)
```

### Backend & AI Integration
```
Python 3.9+ (Backend Logic)
Flask (Web Framework)
OpenAI API (GPT Models)
ConvAI (Character AI)
ElevenLabs API (Voice Synthesis)
Google Sheets API (Data Management)
```

### Database & Infrastructure
```
Firebase (Authentication, Realtime Database, Storage)
Git/GitHub (Version Control)
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  ┌──────────────────┐       ┌──────────────────┐       │
│  │   React Web App  │       │   Unity VR App   │       │
│  │   (TypeScript)   │       │  (C# Scripts)    │       │
│  └──────────────────┘       └──────────────────┘       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway Layer                     │
│                    (Flask Backend)                       │
└─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   OpenAI API │  │ ElevenLabs   │  │   ConvAI     │
│   (GPT-4)    │  │   (Voice)    │  │ (Characters) │
└──────────────┘  └──────────────┘  └──────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │   Firebase Database      │
              │  (User Data & Analytics) │
              └──────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.9+
- Unity 2022.3+ (for VR development)
- Firebase account
- API Keys: OpenAI, ElevenLabs, ConvAI



---

## 📁 Project Structure

```
meta-school-vr/
├── web-app/                    # React web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API integration services
│   │   └── utils/             # Helper functions
│   ├── public/
│   └── package.json
│
├── backend/                    # Python Flask backend
│   ├── api/
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # Data models
│   │   └── services/          # Business logic
│   ├── ai/
│   │   ├── openai_service.py  # OpenAI integration
│   │   ├── elevenlabs_service.py
│   │   └── content_generator.py
│   ├── app.py
│   └── requirements.txt
│
├── unity-vr-app/              # Unity VR project
│   ├── Assets/
│   │   ├── Scripts/          # C# game scripts
│   │   ├── Scenes/           # VR scenes
│   │   ├── Prefabs/          # Reusable game objects
│   │   ├── Models/           # 3D models
│   │   └── Materials/        # Textures and materials
│   └── ProjectSettings/
│
└── docs/                      # Documentation
    ├── API.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

---

## 🔧 Configuration

### Environment Variables

#### Web App (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_API_BASE_URL=http://localhost:5000
```

#### Backend (.env)
```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
CONVAI_API_KEY=...
GOOGLE_SHEETS_CREDENTIALS=path/to/credentials.json
FIREBASE_ADMIN_SDK=path/to/firebase-admin-sdk.json
FLASK_ENV=development
PORT=5000
```

---

## 📊 Performance Metrics

### Learning Enhancement Statistics
- **Information Retention**: 65% improvement over traditional methods
- **Student Engagement**: Up to 400% increase with XR technology
- **Concept Understanding**: Measurable improvement in test scores
- **Global Reach**: 65+ language support for diverse learners

---



---

## 🎮 VR Controls

### Meta Quest / PCVR
- **Trigger**: Select/Interact with objects
- **Grip**: Grab and move objects
- **Thumbstick**: Locomotion (movement)
- **A/X Button**: Open menu
- **B/Y Button**: Toggle AI assistant

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues & Roadmap

### Current Known Issues
- VR performance optimization needed for mobile Quest devices
- Multi-user synchronization latency in metaverse environments
- Voice recognition accuracy in noisy environments

### Upcoming Features
- [ ] AR mode for mobile devices
- [ ] Advanced physics simulations for science education
- [ ] Teacher dashboard for classroom management
- [ ] Offline mode with content caching
- [ ] Integration with popular LMS platforms
- [ ] Advanced analytics with predictive modeling

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team CheatCode

- **Archi Kanungo** - Lead Developer
- **GK Prudhvi Raj** - AI/ML Engineer
- **Bakshi Vaishvik** - VR Architect

*Together, we're shaping the future of education through immersive technology.*

---



## 🙏 Acknowledgments

- OpenAI for GPT API access
- ElevenLabs for voice synthesis technology
- ConvAI for conversational AI integration
- Unity Technologies for the game engine
- Firebase for backend infrastructure

---

**⭐ If you find this project helpful, please consider giving it a star!**

*Let's revolutionize how the world learns!*


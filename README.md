# 🧠💙 Mental Health Support System for Students

A comprehensive digital mental health platform designed specifically for students in higher education, providing secure access to mental health resources, assessments, and professional support.

![Mental Health Support System](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.0-blue) ![Descope Auth](https://img.shields.io/badge/Descope-Authentication-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎯 **Three-Portal Authentication System**
- **👨‍🎓 Student Portal**: Full access with Descope authentication
- **👨‍⚕️ Counselor Portal**: Professional dashboard (Coming Soon)
- **⚙️ Administrator Portal**: System management (Coming Soon)

### 🔐 **Secure Authentication**
- **Descope Integration**: Modern, secure authentication flow
- **HIPAA Compliant**: Healthcare-grade security standards
- **Multi-Factor Authentication**: Enhanced account protection
- **End-to-End Encryption**: Complete data security

### 🎨 **Modern UI/UX Design**
- **Glassmorphism Effects**: Modern, professional aesthetic
- **Responsive Design**: Perfect on all devices
- **Animated Interactions**: Engaging user experience
- **Accessibility Features**: WCAG compliant design
- **Custom Animations**: Smooth transitions and effects

### 🧠 **Mental Health Features**
- **📊 Stress Assessments**: Validated mental health questionnaires
- **🤖 AI Chatbot**: 24/7 support powered by Google Gemini
- **📚 Resource Library**: Curated mental health resources
- **👥 Counseling Connect**: Professional support access
- **📈 Progress Tracking**: Personal mental health journey

### 🛠️ **Technical Highlights**
- **React 18**: Latest React features and performance
- **Tailwind CSS**: Utility-first styling framework
- **LocalStorage**: Secure client-side data persistence
- **Webpack Optimization**: Fast loading and performance
- **Cross-Browser Support**: Works on all modern browsers

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yogesh35/mental-health-support-system.git
   cd mental-health-support-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_DESCOPE_PROJECT_ID=your_descope_project_id
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Application Flow

### 1. **Home Page** (`/`)
- Welcome interface with feature overview
- "Start Your Mental Health Journey" call-to-action
- Professional healthcare design

### 2. **Role Selection** (`/role-selection`)
- Choose between Student, Counselor, or Administrator
- Interactive cards with feature descriptions
- Clear availability status for each portal

### 3. **Student Authentication** (`/auth`)
- Enhanced Descope authentication flow
- Security features highlighted
- Professional loading states

### 4. **Dashboard** (`/dashboard`)
- Personalized mental health overview
- Quick access to all features
- Progress tracking and statistics

### 5. **Mental Health Assessment** (`/mental-health-test`)
- Comprehensive 6-question assessment
- Emoji-enhanced multiple choice options
- Detailed results with recommendations

### 6. **User Profile** (`/user`)
- Personal information management
- Assessment history tracking
- Privacy settings and controls

### 7. **AI Chatbot** (`/chatbot`)
- 24/7 mental health support
- Google Gemini-powered responses
- Conversational interface

## 🎨 Design System

### Color Palette
- **Primary**: Indigo to Purple gradient (`from-indigo-900 to-purple-800`)
- **Secondary**: Blue to Cyan gradient (`from-blue-500 to-cyan-600`)
- **Accent**: Pink to Purple gradient (`from-pink-500 to-purple-600`)
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### Typography
- **Headings**: Inter font family, gradient text effects
- **Body**: System font stack for optimal readability
- **Emphasis**: Bold weights with color variations

### Components
- **Glassmorphism Cards**: Semi-transparent with backdrop blur
- **Interactive Buttons**: Gradient backgrounds with hover effects
- **Form Elements**: Enhanced inputs with focus states
- **Loading States**: Animated spinners and progress indicators

## 🔧 Technical Architecture

### Frontend Stack
- **React 18**: Component-based architecture
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Custom CSS**: Enhanced animations and effects

### Authentication
- **Descope SDK**: Secure authentication provider
- **JWT Tokens**: Session management
- **Protected Routes**: Role-based access control

### State Management
- **React Hooks**: useState, useEffect, useContext
- **LocalStorage**: Client-side data persistence
- **Session Storage**: Temporary data handling

### API Integration
- **Google Gemini**: AI chatbot functionality
- **Descope API**: Authentication services
- **RESTful Design**: Clean API integration patterns

## 📊 Performance Optimizations

### Webpack Configuration
- **Custom rewiring**: Optimized build process
- **Bundle splitting**: Code splitting for better performance
- **Tree shaking**: Unused code elimination
- **Minification**: Compressed production builds

### Loading Optimizations
- **Lazy loading**: Component-level code splitting
- **Image optimization**: Compressed and responsive images
- **Caching strategies**: Browser and service worker caching
- **Preloading**: Critical resource prioritization

## 🔒 Security Features

### Authentication Security
- **Multi-factor authentication**: Enhanced login security
- **Session management**: Secure token handling
- **Password policies**: Strong password requirements
- **Account protection**: Brute force prevention

### Data Protection
- **HIPAA Compliance**: Healthcare data standards
- **End-to-end encryption**: Complete data security
- **Privacy controls**: User data management
- **Audit logging**: Security event tracking

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Optimized for React applications
- **Netlify**: JAMstack deployment
- **AWS S3**: Static website hosting
- **Azure Static Web Apps**: Enterprise deployment

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_DESCOPE_PROJECT_ID` | Descope authentication project ID | Yes |
| `REACT_APP_GEMINI_API_KEY` | Google Gemini API key for chatbot | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Write comprehensive tests
- Follow accessibility guidelines
- Maintain code documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 Healthcare Compliance

This application is designed with healthcare data privacy in mind:
- **HIPAA Compliance**: Following healthcare data protection standards
- **Privacy by Design**: Built-in privacy protections
- **Data Minimization**: Collecting only necessary information
- **User Consent**: Clear data usage policies

## 📞 Support

For support and questions:
- **Email**: support@mentalhealthsystem.com
- **Documentation**: [Wiki](https://github.com/yogesh35/mental-health-support-system/wiki)
- **Issues**: [GitHub Issues](https://github.com/yogesh35/mental-health-support-system/issues)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Student authentication and dashboard
- ✅ Mental health assessments
- ✅ AI chatbot integration
- ✅ Resource library

### Phase 2 (Q4 2024)
- 🔄 Counselor portal development
- 🔄 Appointment scheduling system
- 🔄 Video call integration
- 🔄 Advanced analytics

### Phase 3 (Q1 2025)
- 🔄 Administrator portal
- 🔄 Institution-wide analytics
- 🔄 Custom assessment creation
- 🔄 Integration APIs

---

**Made with ❤️ for student mental health and wellbeing**

*This project aims to make mental health support more accessible and engaging for students in higher education.*

# Photo Gallery App with Descope Authentication

A modern React photo gallery application with secure authentication powered by Descope. Features include user authentication, photo browsing, and user management.

## Features

- 🔐 **Secure Authentication** - Powered by Descope
- 📸 **Photo Gallery** - Beautiful responsive photo grid
- 👥 **User Management** - View all registered users
- 🎨 **Modern UI** - Built with Tailwind CSS
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Descope React SDK

**Backend:**
- Node.js
- Express.js
- Axios
- CORS

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Descope account and project

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/photo-gallery-app.git
cd photo-gallery-app
```

### 2. Install Dependencies

**Install frontend dependencies:**
```bash
npm install
```

**Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

**Frontend Environment:**
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` with your Descope project details:
```env
REACT_APP_DESCOPE_PROJECT_ID=your_project_id_here
REACT_APP_DESCOPE_FLOW_ID=sign-up-or-in
```

**Backend Environment:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your Descope management key:
```env
DESCOPE_PROJECT_ID=your_project_id_here
DESCOPE_MANAGEMENT_KEY=your_management_key_here
PORT=3001
```

### 4. Run the Application

**Start the backend server:**
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001`

**Start the frontend (in a new terminal):**
```bash
cd ..
npm start
```
The frontend will run on `http://localhost:3000`

## Application Flow

1. **Home Page** - Landing page with "Get Started" button
2. **Authentication** - Descope-powered sign up/sign in flow
3. **Dashboard** - Photo gallery with beautiful image grid
4. **User Management** - View all registered users (accessible via "View Users" button)

## API Endpoints

### Backend API (`http://localhost:3001`)

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Fetch all users from Descope

## Project Structure

```
photo-gallery-app/
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Auth.js
│   │   ├── Dashboard.js
│   │   └── User.js
│   ├── App.js
│   └── index.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── public/
├── package.json
└── README.md
```

## Configuration

### Descope Setup

1. Create a Descope account at [descope.com](https://descope.com)
2. Create a new project
3. Note your Project ID and Management Key
4. Create a flow named "sign-up-or-in" or use an existing one
5. Update your environment variables

### Tailwind CSS

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.

## Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in your hosting platform

### Backend Deployment (Heroku/Railway)

1. Deploy the `backend` folder
2. Set environment variables
3. Update frontend API URLs to point to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## Troubleshooting

### Common Issues

**Port already in use:**
- Frontend: Change port with `PORT=3002 npm start`
- Backend: Update `PORT` in `backend/.env`

**Authentication not working:**
- Verify Descope Project ID and Flow ID
- Check network requests in browser dev tools
- Ensure backend is running and accessible

**Users not loading:**
- Verify backend environment variables
- Check backend logs for API errors
- Ensure management key has proper permissions

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.

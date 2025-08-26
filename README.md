# Gooma United Soccer Team Website

A modern React application for the Gooma United soccer team, built with Vite and deployed on Netlify.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Multi-language Support**: English and Dutch translations
- **Real-time Data**: Firebase integration for matches, players, and news
- **Admin Panel**: Full content management system
- **Modern UI**: Glass-morphism effects and smooth animations
- **PWA Ready**: Optimized for performance and user experience

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Firebase (Firestore, Auth)
- **Icons**: Lucide React
- **Internationalization**: i18next
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gooma-united-soccer-team
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment to Netlify

### Option 1: Git Integration (Recommended)

1. **Connect your repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure build settings**
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Environment variables**
   Add your Firebase environment variables in Netlify's environment settings

4. **Deploy**
   Netlify will automatically build and deploy your site

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify's deployment page
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

## ⚙️ Configuration Files

### `netlify.toml`
- Build settings and environment configuration
- Security headers and caching rules
- SPA redirects for client-side routing

### `public/_redirects`
- Additional redirect rules for Netlify
- API function routing (for future use)

### `vite.config.js`
- Optimized build configuration for Netlify
- Code splitting and asset optimization
- Production optimizations

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
gooma-united-soccer-team/
├── public/                 # Static assets
│   ├── _redirects         # Netlify redirects
│   ├── hero.jpg           # Hero image
│   └── ...
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # Firebase services
│   ├── lib/              # Library configurations
│   └── locales/          # Translation files
├── netlify.toml           # Netlify configuration
├── vite.config.js         # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🌐 Live Site

- **Production URL**: [Your Netlify URL]
- **Admin Panel**: `/admin` (requires authentication)

## 🔒 Security Features

- Firebase Authentication for admin access
- Security headers configured in `netlify.toml`
- XSS protection and content security policies
- Secure API endpoints (when using Netlify functions)

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized images and assets
- Fast loading times

## 🚀 Performance Optimizations

- Code splitting for better loading times
- Image optimization and caching
- Lazy loading for components
- Production build optimizations

## 📞 Support

For deployment issues or questions, check:
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
- [Firebase Documentation](https://firebase.google.com/docs)

## 📄 License

This project is private and proprietary to Gooma United Soccer Team.

# ImageCompressor

A modern, full-stack image compression web application built with React, TypeScript, and Node.js.

## Features

- 🖼️ **Image Compression**: Compress images while maintaining quality
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components
- ⚡ **Fast Performance**: Optimized with Vite and modern build tools
- 🔒 **Security**: Built-in security features and validation
- 📊 **Analytics Ready**: Integrated ad slots for monetization

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Wouter** for routing
- **React Query** for data fetching

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **Helmet** for security headers
- **Rate limiting** for API protection

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rakeshsharma23072005/ImageCompressor.git
   cd ImageCompressor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5137`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run test:all` - Run all tests
- `npm run preview` - Preview production build

## Project Structure

```
ImageCompressor/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── styles/        # Global styles
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── vite.ts           # Vite integration
├── shared/               # Shared types and utilities
├── test/                 # Test files
└── scripts/              # Build and utility scripts
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission
- `POST /api/compress` - Image compression endpoint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

## Acknowledgments

- Built with modern web technologies
- Inspired by the need for efficient image compression tools
- Thanks to all contributors and the open-source community

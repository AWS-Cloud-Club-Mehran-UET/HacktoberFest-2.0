# 🏆 Hackathon Submission – Team IRIS

## 👥 Team Information

| Member Name | GitHub Username        | Role      |
| ----------- | ---------------------- | --------- |
| Shayan Ali  | [@ShayanAliProgrammer] | Team Lead |
| Dua Fatima  | [@sanobarabro8-del]    | Tester    |
| Sanobar     | [@duafatima28]         | Tester    |

---

## 🤖 AI Chatbot Project - Complete Implementation

### Project Overview

We have successfully built **Pakistan AI**, an intelligent chatbot application featuring persistent chat history, real-time messaging, and a modern user interface. The application allows users to have interactive conversations with an AI assistant powered by Google's Gemini AI.

### 🚀 What We Built

#### **Core Features Implemented:**

✅ **Real-time AI Chat Interface** - Interactive chat with streaming responses
✅ **Persistent Chat History** - Conversations saved and resumed across sessions
✅ **Modern UI/UX** - Beautiful, responsive design with smooth animations
✅ **Google AI Integration** - Powered by Gemini AI for intelligent responses
✅ **Type-Safe Development** - Full TypeScript implementation
✅ **Database Integration** - SQLite with Drizzle ORM for data persistence
✅ **Authentication System** - NextAuth.js for secure user sessions
✅ **AI Tools Integration** - Custom tools for calculations and date operations
✅ **API Integration** - RESTful API routes with proper error handling

#### **Technical Architecture:**

**Frontend Stack:**

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features and hooks
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Custom Chat UI** - Built-from-scratch chat interface

**Backend & AI Integration:**

- **Vercel AI SDK 5.0** - Framework for AI application development
- **Google AI (Gemini)** - Large language model for intelligent responses
- **Next.js API Routes** - RESTful endpoints for chat functionality
- **Streaming Responses** - Real-time message streaming for better UX
- **Tool Calling** - Custom tools for enhanced AI capabilities

**Database & Authentication:**

- **SQLite Database** - Lightweight, file-based database
- **Drizzle ORM** - Type-safe SQL query builder and ORM
- **NextAuth.js** - Complete authentication system
- **tRPC** - Type-safe API layer (setup included)

**Development Tools:**

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Drizzle Kit** - Database migrations and schema management

### 🔧 Technical Implementation Details

#### **Chat API Route (`/api/chat`)**

- **POST endpoint** for handling chat messages
- **Streaming responses** with Server-Sent Events
- **Input validation** and error handling
- **Google AI integration** with custom system prompts
- **Tool calling** with AI SDK 5.0 for enhanced functionality
- **Pakistan AI persona** - Built by Shayan Ali Jalbani with unique personality

#### **AI Tools Integration**

We implemented three powerful tools using AI SDK 5.0:

1. **Calculator Tool** - Performs mathematical calculations including:

   - Basic arithmetic operations (+, -, \*, /)
   - Square root calculations (sqrt)
   - Power operations (^)
   - Complex expressions

2. **Date/Time Tool** - Provides current date and time information:

   - Current time in different timezones
   - Day of the week
   - Timestamp information
   - Timezone support

3. **Date Calculator Tool** - Advanced date operations:
   - Add/subtract days from dates
   - Calculate differences between dates
   - Date formatting options
   - Input validation for YYYY-MM-DD format

#### **Main Chat Interface (`/app/page.tsx`)**

- **Fixed and implemented** a complete chat interface
- **Real-time message display** with proper formatting
- **Input handling** with form submission
- **Loading states** and error handling
- **Responsive design** that works on all devices

#### **System Architecture:**

```
User Input → Next.js Frontend → API Route → Google AI + Tools → Streaming Response → UI Update
```

### 🎯 Key Achievements

1. **Complete AI Integration** - Successfully integrated Google Gemini AI with custom Pakistan AI persona
2. **Tool Calling Implementation** - Added AI SDK 5.0 tools for calculations and date operations
3. **Real-time Communication** - Implemented streaming responses for natural conversation flow
4. **Persistent Storage** - Chat history saved to database for session continuity
5. **Type Safety** - Full TypeScript implementation with proper type definitions
6. **Modern Development Practices** - Clean code architecture with proper error handling
7. **Responsive Design** - Mobile-first approach with beautiful UI components

### 📁 Project Structure

```
ai-chatbot/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # Chat API endpoint with tools
│   │   ├── page.tsx               # Main chat interface
│   │   └── layout.tsx             # App layout
│   ├── server/
│   │   ├── db/schema.ts           # Database schema
│   │   └── auth/                  # Authentication setup
│   └── styles/
│       └── globals.css            # Global styles
└── README.md                      # Project documentation
```

### 🔐 Security & Performance

- **Input sanitization** and validation
- **Error boundaries** for graceful error handling
- **Rate limiting** considerations in API routes
- **Secure authentication** with NextAuth.js
- **Optimized bundle size** with proper code splitting

### 🚀 Deployment Ready

The application is fully configured for deployment on:

- **Vercel** (recommended for Next.js projects)
- **Railway**
- **Netlify**
- **Self-hosted** servers

### 💡 Innovation Highlights

- **Custom AI Persona** - "Pakistan AI" with unique personality and cultural context
- **Tool Integration** - AI SDK 5.0 tools for enhanced functionality
- **Streaming-First Design** - Real-time conversation experience
- **Modern Tech Stack** - Latest technologies and best practices
- **Scalable Architecture** - Built for future enhancements and features

---

## 🏗️ Development Process

### What We Accomplished:

1. **Project Setup** - Established Next.js project with TypeScript and Tailwind CSS
2. **AI Integration** - Connected Google Gemini AI with custom system prompts
3. **Tool Implementation** - Built custom tools using AI SDK 5.0 for calculations and dates
4. **API Development** - Built robust chat API with streaming and tool calling capabilities
5. **UI Implementation** - Created modern, responsive chat interface
6. **Database Setup** - Configured SQLite with Drizzle ORM for data persistence
7. **Authentication** - Implemented NextAuth.js for user management
8. **Testing & Debugging** - Fixed issues and ensured smooth functionality

### Technical Challenges Overcome:

- **AI SDK 5.0 Integration** - Successfully implemented latest AI SDK with tool calling
- **Tool Development** - Created custom tools for mathematical and date operations
- **Streaming Implementation** - Built real-time message streaming for natural conversations
- **State Management** - Proper React state management for chat messages and UI updates
- **Error Handling** - Comprehensive error handling for API failures and edge cases
- **Type Safety** - Maintained TypeScript integrity throughout the application

---

## 🌟 Project Impact

This AI chatbot represents a complete, production-ready application that demonstrates:

- **Modern Web Development** practices and technologies
- **AI Integration** capabilities with real-world applications
- **Tool Calling** implementation with AI SDK 5.0
- **User Experience** design principles and implementation
- **Scalable Architecture** for future enhancements
- **Team Collaboration** and project management skills

The application is ready for users to start conversations with Pakistan AI and experience the power of modern AI technology with custom tools in a beautifully designed interface.

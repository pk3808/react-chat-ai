# React AI Chatbot

Empower your website with an intelligent AI chat assistant. This React component integrates seamlessly to provide instant support using Google Gemini or OpenAI.

![License](https://img.shields.io/npm/l/react-chat-ai)
![Version](https://img.shields.io/npm/v/react-chat-ai)

## ✨ Features

- **Multiple Providers**: Built-in support for Google Gemini and OpenAI.
- **Fully Customizable**: Control colors, fonts, positioning, and styles.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Branding**: Add your own logo, bot name, and welcome messages.
- **Type-Safe**: Written in TypeScript with comprehensive type definitions.

## 🚀 Installation

```bash
npm install react-chat-ai
# or
yarn add react-chat-ai
```

## 💻 Usage

### Basic Example (Gemini)

```tsx
import React from 'react';
import ChatBot from 'react-chat-ai';

const App = () => {
  return (
    <div className="App">
      <ChatBot 
        apiKey="YOUR_GEMINI_API_KEY"
        provider="gemini"
        websiteInfo={{
          title: "My Awesome Site",
          description: "A platform for amazing things."
        }}
      />
    </div>
  );
};

export default App;
```

### OpenAI Example

```tsx
<ChatBot 
  apiKey="YOUR_OPENAI_API_KEY"
  provider="openai"
  model="gpt-4"
  branding={{
    primaryColor: "#10a37f",
    logo: "https://example.com/openai-logo.png"
  }}
/>
```



## ⚙️ Configuration

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | `''` | API Key for the selected provider. |
| `provider` | `'gemini' \| 'openai'` | `'gemini'` | The AI provider to use. |
| `model` | `string` | `undefined` | Specific model to use (e.g., 'gpt-4', 'gemini-1.5-pro'). |
| `websiteInfo` | `WebsiteInfo` | `{}` | Information about your site for context. |
| `branding` | `Branding` | `{}` | Visual customization options. |
| `customization` | `Customization` | `{}` | UI behavior and positioning. |
| `colorTheme` | `ColorTheme` | `{}` | Granular color overrides. |

| `onMessageSent` | `(msg: string) => void` | `undefined` | Callback when user sends a message. |
| `onResponseReceived` | `(res: string) => void` | `undefined` | Callback when bot responds. |

### Types

#### WebsiteInfo
```ts
{
  title?: string;       // Name of your website/bot
  description?: string; // Context for the AI
  url?: string;         // Website URL
}
```

#### Branding
```ts
{
  logo?: string;         // URL to logo image
  primaryColor?: string; // Main brand color (buttons, user bubbles)
  accentColor?: string;  // Secondary color
  fontFamily?: string;   // CSS font-family
}
```

#### Customization
```ts
{
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
```

## 🎨 Advanced Theming

You can override specific colors using the `colorTheme` prop:

```tsx
<ChatBot 
  colorTheme={{
    botMessageBg: "#f0f0f0",
    userMessageBg: "#007bff",
    bodyBg: "#ffffff",
    // ... see ColorTheme interface for all options
  }}
/>
```

## 🔒 Security Note

**Important**: Be cautious when using API keys in the frontend. Ensure you restrict your API keys in your provider's dashboard to your specific domain to prevent unauthorized usage.

## 📄 License

MIT © [Piyush Kumar](https://github.com/pk3808)

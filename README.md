# React AI Chatbot

A customizable AI chatbot component for React and Next.js applications. This component allows you to integrate AI chat capabilities into your website with support for multiple providers (Gemini, OpenAI, and custom endpoints).

## Features

- Support for multiple AI providers (Gemini, OpenAI, Custom)
- Customizable appearance and branding
- Responsive design that works on mobile and desktop
- Dark/light/automatic theme support
- Easy to integrate and configure

## Installation

```bash
npm install react-ai-chatbot
```

## Usage

```jsx
import ChatBot from 'react-ai-chatbot';

function App() {
 return (
    <div className="App">
      <ChatBot
        apiKey="your-api-key"
        provider="gemini" // or "openai" or "custom"
        websiteInfo={{
          title: "My Website",
          description: "A description of your website"
        }}
        branding={{
          primaryColor: "#FF6B35",
          accentColor: "#4F46E5",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
        customization={{
          position: "bottom-right", // or "bottom-left"
          theme: "light" // or "dark" or "auto"
        }}
        onMessageSent={(message) => console.log("Message sent:", message)}
        onResponseReceived={(response) => console.log("Response received:", response)}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `apiKey` | string | API key for the selected provider (optional if using simulated responses) |
| `provider` | string | AI provider to use: "gemini", "openai", or "custom" |
| `websiteInfo` | object | Information about your website for context |
| `branding` | object | Branding options like colors and font family |
| `customization` | object | Customization options like position and theme |
| `colorTheme` | object | Detailed color theme options for fine-grained control |
| `onMessageSent` | function | Callback when a message is sent |
| `onResponseReceived` | function | Callback when a response is received |
| `customApiEndpoint` | string | Custom API endpoint (required when provider is "custom") |
| `model` | string | Specific model to use (optional) |

## Color Theme Options

The `colorTheme` prop allows you to customize the appearance of the chatbot:

```js
{
  botMessageBg: "#F3F4F6",
  botMessageText: "#1F2937",
  botMessageBorder: "#E5E7EB",
  userMessageBg: "#FF6B35",
  userMessageText: "#FFFFFF",
  // ... and more options
}
```

## Contributing

We welcome contributions to this project! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the ISC License.

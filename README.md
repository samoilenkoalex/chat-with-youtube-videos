# Youtube video chat app
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![Maintaner](https://img.shields.io/static/v1?label=Oleksandr%20Samoilenko&message=Maintainer&color=red)](mailto:oleksandr.samoilenko@extrawest.com)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)]()
![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)
![GitHub release](https://img.shields.io/badge/release-v1.0.0-blue)

## PROJECT INFO
- **Flutter web app with LangChain framework  for chatting with youtube videos**
- **The app is a a solution for chatting on english youtube video content. The app uses youtube video subtitles, splits them into chunks and saves to Pinecone vector store**

## Features
- LangChain Framework
- Pinecone vector store
- OpenAI gpt-3.5-turbo model
- Tavily search engine for generating fallback results

## Preview

1. Add Credentials and Youtube link





2. Chat on video content





## Installing:
**1. Clone this repo to your folder:**

```
git clone https://github.com/extrawest/Chat-with-YouTube-Videos.git
```

**2. Change current directory to the cloned folder:**

```
cd chat-with-youtube-videos/mobile
```

**3. Get packages**

```
flutter pub get
```

## Setup Server
**1. Open server folder:**

```
cd chat-with-youtube-videos/server
```

**2. Change server path in flutter project:**
Go to app/lib/services/api_service.dart and change the baseUrl to your server path

**3. run flutter web and fill in credentials on the homepage**


Created by Oleksandr Samoilenko

[Extrawest.com](https://www.extrawest.com), 2024


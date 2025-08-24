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

https://github.com/user-attachments/assets/60452c79-b4b2-41cc-a5d0-03ea16fef396


2. Chat on video content

https://github.com/user-attachments/assets/07b27aab-fb47-4a50-90f2-5ee91d3d6c6c



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


Created by Oleksandr Samoilenko, 2024


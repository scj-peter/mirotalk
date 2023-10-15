# <p align="center">MiroTalk P2P</p>

<p align="center">Free WebRTC - P2P - Simple, Secure, Fast Real-Time Video Conferences with support for up to 4k resolution and 60fps. It's compatible with all major browsers and platforms.</p>

<hr />

<p align="center">
    <a href="https://p2p.mirotalk.com">Explore MiroTalk P2P</a>
</p>

<hr />

<p align="center">
    <a href="https://p2p.mirotalk.com"><img src="public/images/mirotalk-header.gif"></a>
</p>

<hr />

<p align="center">
    Join our community for questions, discussions, and support on <a href="https://discord.gg/rgGYfeYW3N">Discord</a>
</p>

<hr />

<details>
<summary>Features</summary>

<br/>

-   Is `100% Free` - `Open Source (AGPLv3)` - `Self Hosted` and [PWA](https://en.wikipedia.org/wiki/Progressive_web_application)!
-   No downloads, plugins, or logins required – completely browser-based.
-   Unlimited conference rooms with no time limitations.
-   Translated into 133 languages.
-   Host protection to prevent unauthorized access.
-   Room password protection.
-   Compatible with desktop and mobile devices.
-   Optimized mobile room URL sharing.
-   Webcam streaming with front and rear camera support for mobile devices.
-   Crystal-clear audio streaming with speaking detection and volume indicators.
-   Screen sharing for presentations.
-   File sharing with drag-and-drop support.
-   Choose your audio input, output, and video source.
-   Supports video quality up to 4K and 60 FPS.
-   Supports advance Picture-in-Picture (PiP) offering a more streamlined and flexible viewing experience.
-   Record your screen, audio, and video.
-   Snapshot video frames and save them as PNG images.
-   Chat with an Emoji Picker for expressing feelings, private messages, Markdown support, and conversation saving.
-   ChatGPT (powered by OpenAI) for answering questions, providing information, and connecting users to relevant resources.
-   Speech recognition for sending spoken messages.
-   Push-to-talk functionality, similar to a walkie-talkie.
-   Advanced collaborative whiteboard for teachers.
-   Real-time sharing of YouTube embed videos, video files (MP4, WebM, OGG), and audio files (MP3).
-   Full-screen mode with one-click video element zooming and pin/unpin.
-   Customizable UI themes.
-   Right-click options on video elements for additional controls.
-   Direct peer-to-peer connections for low-latency communication through WebRTC.
-   Supports [REST API](app/api/README.md) (Application Programming Interface).
-   Integration with [Slack](https://api.slack.com/apps/) for enhanced communication.
-   Utilizes [Sentry](https://sentry.io/) for error reporting.
-   And much more...

</details>

<details>
<summary>About</summary>

<br>

-   [Presentation](https://www.canva.com/design/DAE693uLOIU/view)
-   [Video Overview](https://www.youtube.com/watch?v=_IVn2aINYww)

</details>

<details>
<summary>Start videoconference</summary>

<br/>

1. `Open` [MiroTalk P2P](https://p2p.mirotalk.com/newcall) or [alternative link](https://mirotalk.up.railway.app/newcall).
2. `Choose` a room name and click **Join Room**.
3. `Grant` camera and microphone access.
4. `Share` the room URL and wait for participants to join the video conference.

</details>

<details>
<summary>Direct Join</summary>

<br/>

-   You can `directly join a room` by using links like:
-   https://p2p.mirotalk.com/join?room=test&name=mirotalk&audio=0&video=0&screen=0&notify=0
-   https://mirotalk.up.railway.app/join?room=test&name=mirotalk&audio=0&video=0&screen=0&notify=0

    | Params | Type    | Description     |
    | ------ | ------- | --------------- |
    | room   | string  | Room Id         |
    | name   | string  | User name       |
    | audio  | boolean | Audio stream    |
    | video  | boolean | Video stream    |
    | screen | boolean | Screen stream   |
    | notify | boolean | Welcome message |

> **Note**
>
> When [host protection is enabled](https://github.com/miroslavpejic85/mirotalk/commit/285c92605585bf204996dc0bade9b3e7c62d75df#commitcomment-103108955) the host needs to provide a valid username and password as specified in the `.env`.
>
> After host authentication, participants can join the room using any of the following URL formats:
>
> -   https://p2p.mirotalk.com/join/test (URL path)
> -   https://p2p.mirotalk.com/join/?room=test&name=mirotalk&audio=0&video=0&screen=0&notify=0 (URL with query parameters for direct join)

</details>

<details>
<summary>Embed a meeting</summary>

<br/>

To embed a meeting in `your service or app` using an iframe, use the following code:

```html
<iframe
    allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay"
    src="https://p2p.mirotalk.com/newcall"
    style="height: 100vh; width: 100vw; border: 0px;"
></iframe>
```

</details>

<details open>
<summary>Quick start</summary>

<br/>

-   Before running MiroTalk P2P, ensure you have `Node.js` installed. This project has been tested with Node versions [12.X](https://nodejs.org/en/blog/release/v12.22.1/), [14.X](https://nodejs.org/en/blog/release/v14.17.5/), [16.X](https://nodejs.org/en/blog/release/v16.15.1/) and [18.x](https://nodejs.org/en/download).

```bash
# clone this repo
$ git clone https://github.com/miroslavpejic85/mirotalk.git
# go to mirotalk dir
$ cd mirotalk
# copy .env.template to .env (edit it according to your needs)
$ cp .env.template .env
# install dependencies
$ npm install
# start the server
$ npm start
```

-   Open [http://localhost:3000](http://localhost:3000) in your browser.

</details>

<details open>
<summary>Docker</summary>

<br/>

![docker](public/images/docker.png)

-   Repository [docker hub](https://hub.docker.com/r/mirotalk/p2p)
-   Install [docker engine](https://docs.docker.com/engine/install/) and [docker compose](https://docs.docker.com/compose/install/)

```bash
# copy .env.template to .env (edit it according to your needs)
$ cp .env.template .env
# Copy docker-compose.template.yml in docker-compose.yml (edit it according to your needs)
$ cp docker-compose.template.yml docker-compose.yml
# Get official image from Docker Hub
$ docker pull mirotalk/p2p:latest
# create and start containers
$ docker-compose up # -d
# to stop and remove resources
$ docker-compose down
```

-   Open [http://localhost:3000](http://localhost:3000) in your browser.

</details>

<details>
<summary>Ngrok - Https</summary>

<br/>

You can start a video conference directly from your local PC and make it accessible from any device outside your network by following [these instructions](docs/ngrok.md), or expose it directly on [HTTPS](app/ssl/README.md).

</details>

<details>
<summary>Stun & Turn</summary>

<br/>

Install your own [Stun & Turn](https://docs.mirotalk.com/coturn/stun-turn/) by following [this instructions](./docs/coturn.md).

</details>

<details>
<summary>Self Hosting</summary>

<br/>

For `self-hosting MiroTalk P2P` on your own dedicated server, please refer to [this comprehensive guide](docs/self-hosting.md). It will provide you with all the necessary instructions to get your MiroTalk P2P instance up and running smoothly.

</details>

<details>
<summary>Rest API</summary>

<br/>

-   The [API documentation](https://docs.mirotalk.com/mirotalk-p2p/api/) uses [swagger](https://swagger.io/) at http://localhost:3000/api/v1/docs. Or check it out on [live](https://p2p.mirotalk.com/api/v1/docs).

```bash
# The response will give you a entrypoint / Room URL for your meeting, where authorization: API_KEY_SECRET.
$ curl -X POST "http://localhost:3000/api/v1/meeting" -H "authorization: mirotalk_default_secret" -H "Content-Type: application/json"
$ curl -X POST "https://p2p.mirotalk.com/api/v1/meeting" -H "authorization: mirotalk_default_secret" -H "Content-Type: application/json"
$ curl -X POST "https://mirotalk.up.railway.app/api/v1/meeting" -H "authorization: mirotalk_default_secret" -H "Content-Type: application/json"
```

</details>

<details open>
<summary>Hetzner</summary>

<br/>

[![Hetzner](public/sponsors/Hetzner.png)](https://hetzner.cloud/?ref=XdRifCzCK3bn)

This application is running for `demonstration purposes` on [Hetzner](https://www.hetzner.com/), one of `the best` [cloud providers](https://www.hetzner.com/cloud) and [dedicated root servers](https://www.hetzner.com/dedicated-rootserver).

---

Use [my personal link](https://hetzner.cloud/?ref=XdRifCzCK3bn) to receive `€⁠20 IN CLOUD CREDITS`.

---

To set up your own instance of `MiroTalk P2P` on a dedicated cloud server, please refer to our comprehensive [self-hosting documentation](https://docs.mirotalk.com/mirotalk-p2p/self-hosting/). This guide will walk you through the process step by step, ensuring a smooth and successful deployment.

</details>

<details>
<summary>Live Demos</summary>

<br/>

<a target="_blank" href="https://p2p.mirotalk.com"><img src="public/sponsors/Hetzner.png" style="width: 220px;"></a>

https://p2p.mirotalk.com

[![hetzner-qr](public/images/mirotalk-hetzner-qr.png)](https://p2p.mirotalk.com)

<br>

<a target="_blank" href="https://railway.app/new/template/mirotalk?referralCode=mirotalk"><img src="https://railway.app/button.svg" style="width: 220px;"></a>

https://mirotalk.up.railway.app

[![railway-qr](public/images/mirotalk-railway-qr.png)](https://mirotalk.up.railway.app)

</details>

<details>
<summary>Security</summary>

<br/>

For `Security` concerning, please follow [this documentation](./SECURITY.md).

</details>

<details>
<summary>Credits</summary>

<br/>

-   ianramzy (html [template](https://cruip.com/demos/neon/))
-   vasanthv (webrtc-logic)
-   fabric.js (whiteboard)

</details>

<details>
<summary>Contributing</summary>

<br/>

-   Contributions are welcome and greatly appreciated!
-   Just run before `npm run lint`

</details>

<details>
<summary>License</summary>

<br/>

[![AGPLv3](public/images/AGPLv3.png)](LICENSE)

MiroTalk P2P is free and open-source under the terms of AGPLv3 (GNU Affero General Public License v3.0). Please `respect the license conditions`, In particular `modifications need to be free as well and made available to the public`. Get a quick overview of the license at [Choose an open source license](https://choosealicense.com/licenses/agpl-3.0/).

To obtain a [MiroTalk P2P license](https://docs.mirotalk.com/license/licensing-options/) with terms different from the AGPLv3, you can conveniently make your [purchase on CodeCanyon](https://codecanyon.net/item/mirotalk-p2p-webrtc-realtime-video-conferences/38376661). This allows you to tailor the licensing conditions to better suit your specific requirements.

</details>

<details open>
<summary>Support the project</summary>

<br/>

Do you find MiroTalk P2P indispensable for your needs? Join us in supporting this transformative project by [becoming a backer or sponsor](https://github.com/sponsors/miroslavpejic85). By doing so, not only will your logo prominently feature here, but you'll also drive the growth and sustainability of MiroTalk P2P. Your support is vital in ensuring that this valuable platform continues to thrive and remain accessible for all. Make an impact – back MiroTalk P2P today and be part of this exciting journey!

|                                                                                   |                                                                                    |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [![BroadcastX](public/sponsors/BroadcastX.png)](https://broadcastx.de/)           | [![Hetzner](public/sponsors/Hetzner.png)](https://hetzner.cloud/?ref=XdRifCzCK3bn) |
| [![LuvLounge](public/sponsors/LuvLounge.png)](https://luvlounge.ca)               | [![QuestionPro](public/sponsors/QuestionPro.png)](https://www.questionpro.com)     |
| [![BrowserStack](public/sponsors/BrowserStack.png)](https://www.browserstack.com) | [![CrystalSound](public/sponsors/CrystalSound.png)](https://crystalsound.ai)       |

</details>

<br>

<details>
<summary>MiroTalk SFU</summary>

<br/>

Try also [MiroTalk SFU](https://github.com/miroslavpejic85/mirotalksfu), the difference between the two projects you can found [here](https://github.com/miroslavpejic85/mirotalksfu/issues/14#issuecomment-932701999).

</details>

<details>
<summary>MiroTalk C2C</summary>

<br>

Try also [MiroTalk C2C](https://github.com/miroslavpejic85/mirotalkc2c) cam 2 cam.

</details>

<details>
<summary>MiroTalk BRO</summary>

<br>

Try also [MiroTalk BRO](https://github.com/miroslavpejic85/mirotalkbro) live broadcasting.

</details>

<details>
<summary>MiroTalk WEB</summary>

<br>

Try also [MiroTalk WEB](https://github.com/miroslavpejic85/mirotalkwebrtc) rooms scheduler.

</details>

This project is tested with [BrowserStack](https://www.browserstack.com).

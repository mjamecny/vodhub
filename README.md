# VODhub

Little app built with React for searching and saving Twitch VODs, clips and streamers. Favorites are saved to localStorage.

## Features

- Search VODs and clips for specific streamer
- Add VOD, clip or streamer to favorites
- Delete VOD(s), clip(s) or streamer(s) from favorites
- Favorites saved to localStorage
- Open VOD or clip in modal window
- Check if streamer is live
- Copy link to clipboard
- PWA support
- Dark mode

## Screenshot

![frontpage](https://i.imgur.com/bkFUWmW.png)

## Development

Clone the repo

`git clone https://github.com/mjamecny/vodhub.git`

`cd vodhub`

Create .env for enviroment variables

```
VITE_URL=<your site url>
VITE_CLIENT_ID=<your twitch client id>
VITE_TOKEN=Bearer <your twitch bearer token>
```

Install dependencies

`npm i`

Run dev server

`npm run dev `

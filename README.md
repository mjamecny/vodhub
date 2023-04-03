# VODhub

Little app built with React for searching and saving Twitch VODs. Favorites VODs are saved to localStorage.

## Features

- Search VODs for specific streamer
- Add VOD to favorites
- Delete VOD(s) from favorites
- Favorites saved to localStorage
- Open VOD in modal window
- Check if streamer is live

## Screenshot

![frontpage](https://i.imgur.com/ZUKkY3C.png)

## Development

Clone the repo

`git clone https://github.com/mjamecny/vodhub.git`

`cd vodhub`

Create .env.local for enviroment variables

```
REACT_APP_CLIENT_ID=<your twitch client id>
REACT_APP_TOKEN=<your twitch bearer token>
```

Install dependencies

`npm i`

Run dev server

`npm start `

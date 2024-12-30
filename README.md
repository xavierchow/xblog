This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Environment Variables


* `MARKDOWN_FOLDER`: the absolute path of folder with markdown files

## Deploy 

* build
``` bash
docker build . --platform linux/amd64 -t ghcr.io/xavierchow/xblog:latest
```

* run

``` bash
docker run -p 3000:3000 -e MARKDOWN_FOLDER=/app/myposts/ -v /Users/xavier/docker_share/posts:/app/myposts ghcr.io/xavierchow/xblog
```

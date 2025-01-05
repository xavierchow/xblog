This is a blog post project built with [Next.js](https://nextjs.org).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you run `npm run watch`, you can get the live editing feature out of box.

<img src="https://raw.githubusercontent.com/xavierchow/asset/refs/heads/master/blog/live-editing.gif" height="450">

## Environment Variables


* `MARKDOWN_FOLDER`: the absolute path of folder with markdown files.
* `WATCH_MARKDOWN`: yes for live editing experience.

## Deploy 


* build
``` bash
docker build . --platform linux/amd64 -t ghcr.io/xavierchow/xblog:latest
```

* push to github registry

``` bash
docker push ghcr.io/xavierchow/xblog:latest

```

* run

``` bash
docker run -p 3000:3000 -e MARKDOWN_FOLDER=/app/myposts/ -v /host/path/posts:/app/myposts ghcr.io/xavierchow/xblog
```


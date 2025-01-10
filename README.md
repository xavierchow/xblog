This is a blog post project built with [Next.js](https://nextjs.org).

## Why yet another blog log with Next.js?

see: https://xavierz.dev/blog/posts/build-blog-with-nextjs



## How to start

``` bash
npm intall
```

Then run the development server:

```bash
npm run dev
```

## How to write blog posts with live editing
Set `MARKDOWN_FOLDER` to the folder where you put the markdowns,
and run `npm run watch`, you can get the live editing feature out of box.

<img src="https://raw.githubusercontent.com/xavierchow/asset/refs/heads/master/blog/live-editing.gif" height="450">

## Environment Variables


* `MARKDOWN_FOLDER`: the absolute path of folder with markdown files.
* `WATCH_MARKDOWN`: yes for live editing experience.

## How to Deploy 

### Github action
There is an exisiting [github action](https://github.com/xavierchow/xblog/blob/main/.github/workflows/push_image.yml) that helps you to build the docker image and push it to the github registry.

### Manual
You can also build the image manually as follows,

* build
``` bash
docker build . --platform linux/amd64 -t ghcr.io/{namespace}/xblog:latest
```

* push to github registry

``` bash
docker push ghcr.io/{namespace}/xblog:latest

```

* run

``` bash
docker run -p 3000:3000 -e MARKDOWN_FOLDER=/app/myposts/ -v /host/path/posts:/app/myposts ghcr.io/{namespace}/xblog
```


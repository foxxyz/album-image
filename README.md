album-image
===========

Look up images from the [Musicbrainz/Cover Art Archive](https://coverartarchive.org/) via CLI.

Requirements
------------

 * Node 18+ (uses native `fetch`)

Usage
-----

### CLI

#### By album name alone

```bash
npx album-image drukqs
```

#### By artist and album name

```bash
npx album-image Prodigy "the fat of the land" 
```

### API

```bash
npm install album-image
```

#### By album name alone

```js
import { getAlbumImage } from 'album-image'
const url = await getAlbumImage({ album: 'drukqs' })
```

#### By artist and album name

```js
import { getAlbumImage } from 'album-image'
const url = await getAlbumImage({ artist: 'Prodigy', album: 'the fat of the land' })
```

#### Aborting Requests

Requests can be aborted prematurely by using an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController):

```js
import { getAlbumImage } from 'album-image'
const ab = new AbortController()

async function run() {
    try {
        const url = await getAlbumImage({ artist: 'Green Day', album: 'Dookie', signal: ab.signal })
    } catch (err) {
        // will fail with "AbortError: This operation was aborted"
        console.error(err)
    }
}

run()
ab.abort()
```

License
-------

MIT

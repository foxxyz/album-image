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
const url = await getAlbumImage({ albumName: 'drukqs' })
```

#### By artist and album name

```js
import { getAlbumImage } from 'album-image'
const url = await getAlbumImage({ artistName: 'Prodigy', albumName: 'the fat of the land' })
```

License
-------

MIT

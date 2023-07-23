#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import { readFileSync } from 'fs'
import { getAlbumImage } from './index.mjs'

const packageInfo = JSON.parse(readFileSync('./package.json'))
// eslint-disable-next-line camelcase
const parser = new ArgumentParser({ add_help: true, description: packageInfo.description })
parser.add_argument('-v', '--version', { action: 'version', version: packageInfo.version })
parser.add_argument('artist', { nargs: '?', help: 'Artist name' })
parser.add_argument('album', { help: 'Album name' })
const args = parser.parse_args()
try {
    const result = await getAlbumImage({
        album: args.album,
        artist: args.artist,
    })
    process.stdout.write(result)
} catch (e) {
    console.error(e.message)
}
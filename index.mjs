#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

export async function getRelease({ albumName, artist }) {
    // Find correct release
    let query = `release:${albumName}`
    if (artist) query = `${query} AND artist:${artist}`
    const params = new URLSearchParams({ fmt: 'json', query })
    const response = await fetch(`https://musicbrainz.org/ws/2/release-group/?${params.toString()}`)
    const contents = await response.json()
    const { 'release-groups': releases } = contents
    return releases
}

export async function getImage({ id }) {
    const response = await fetch(`https://coverartarchive.org/release-group/${id}`)
    // No image found for this release, try next
    if (response.status === 404) return
    // Rate limit exceeded
    if (response.status === 503) throw new Error('Rate limit exceeded!')
    const { images: [image] } = await response.json()
    return image.image
}

export async function getAlbumImage({ albumName, artist }) {
    let releases = []
    if (artist) {
        releases = await getRelease({ albumName, artist })
    }
    if (!releases.length) {
        releases = await getRelease({ albumName })
    }

    if (!releases.length) {
        throw new Error('No release found!')
    }

    for (const release of releases) {
        const image = await getImage(release)
        if (image) return image
    }

    throw new Error('No cover art found!')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const packageInfo = JSON.parse(readFileSync('./package.json'))
    // eslint-disable-next-line camelcase
    const parser = new ArgumentParser({ add_help: true, description: packageInfo.description })
    parser.add_argument('-v', '--version', { action: 'version', version: packageInfo.version })
    parser.add_argument('artistName', { nargs: '?', help: 'Artist name' })
    parser.add_argument('albumName', { help: 'Album name' })
    const args = parser.parse_args()
    try {
        const result = await getAlbumImage({
            albumName: args.albumName,
            artist: args.artist,
        })
        process.stdout.write(result)
    } catch (e) {
        console.error(e)
    }
}
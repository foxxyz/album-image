import assert from 'node:assert'
import { afterEach, describe, it, mock } from 'node:test'

import { getAlbumImage, getImage, getRelease } from '../index.mjs'

afterEach(() => {
    mock.restoreAll()
})

describe('Release Group Retrieval', () => {
    it('can find a release using artist and album name', async() => {
        const sampleResponse = {
            created: '2023-06-28T05:27:21.190Z',
            count: 1,
            offset: 0,
            'release-groups': [
                {
                    id: '1c31d68c-7ddb-3aff-8961-dc2d27d452ba',
                    'type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
                    score: 100,
                    'primary-type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
                    count: 4,
                    title: 'Dreamer',
                    'first-release-date': '1974',
                    'primary-type': 'Album',
                    'artist-credit': [],
                    releases: [],
                    tags: []
                }
            ]
        }
        mock.method(global, 'fetch', url => {
            if (!url.includes('?fmt=json&query=release%3ADreamer+AND+artist%3ABobby+Bland')) return {}
            return { json: () => sampleResponse, status: 200 }
        })
        const releases = await getRelease({ album: 'Dreamer', artist: 'Bobby Bland' })
        assert.equal(releases[0].id, '1c31d68c-7ddb-3aff-8961-dc2d27d452ba')
    })
    it('can find a release using just the album name', async() => {
        const sampleResponse = {
            created: '2023-06-28T05:27:21.190Z',
            count: 1,
            offset: 0,
            'release-groups': [
                {
                    id: 'c12d5b50-e1af-4646-92d3-70b1caff84ba',
                    'type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
                    score: 100,
                    'primary-type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
                    count: 1,
                    title: 'Dreamer×Dreamer',
                    'first-release-date': '2013-12-30',
                    'primary-type': 'Album',
                    'artist-credit': [],
                    releases: []
                },
                {
                    id: '6125fa28-0644-4657-a2f7-9e4f0a9b7905',
                    'type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
                    score: 100,
                    'primary-type-id': 'f529b476-6e62-324f-b0aa-1f3e33d313fc',
                    count: 1,
                    title: 'DREAMER DREAMER',
                    'first-release-date': '2013-10-25',
                    'primary-type': 'Album',
                    'artist-credit': [],
                    releases: []
                },
            ]
        }
        mock.method(global, 'fetch', url => {
            if (!url.includes('?fmt=json&query=release%3ADreamer')) return {}
            return { json: () => sampleResponse, status: 200 }
        })
        const releases = await getRelease({ album: 'Dreamer' })
        assert.equal(releases[0].id, 'c12d5b50-e1af-4646-92d3-70b1caff84ba')
    })
})
describe('Direct Image Retrieval', () => {
    it('can look up an image using a release ID', async() => {
        const sampleResponse = {
            images: [
                {
                    approved: true,
                    back: false,
                    comment: 'Bobby Bland - Dreamer',
                    edit: 94217183,
                    front: true,
                    id: 34088124793,
                    image: 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493.jpg',
                    thumbnails: {
                        250: 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493-250.jpg',
                        500: 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493-500.jpg',
                        1200: 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493-1200.jpg',
                        large: 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493-500.jpg',
                        small: 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493-250.jpg'
                    },
                    types: ['Front']
                }
            ],
            release: 'https://musicbrainz.org/release/1c31d79c-aaaa-ffff'
        }
        mock.method(global, 'fetch', url => {
            if (!url.includes('/release-group/1c31d68c-aaaa-3aff-8961-2d27d452ba')) return {}
            return { json: () => sampleResponse, status: 200 }
        })
        const image = await getImage({ id: '1c31d68c-aaaa-3aff-8961-2d27d452ba' })
        assert.equal(image, 'http://coverartarchive.org/release/1c31d79c-aaaa-ffff/34028124493.jpg')
    })
})
describe('Fuzzy Image Retrieval', () => {
    it('should error if no releases found', () => {
        mock.fn(getRelease, () => [])
        assert.rejects(getAlbumImage({ album: 'nthontdontd' }), /no matching release found/i)
    })
})
import packageInfo from './package.json' with { type: 'json' }

export async function getRelease({ album, artist, signal }) {
    // Find correct release
    let query = `release:${album}`
    if (artist) query = `${query} AND artist:${artist}`
    const params = new URLSearchParams({ fmt: 'json', query })
    const response = await fetch(`https://musicbrainz.org/ws/2/release-group/?${params.toString()}`, {
        headers: { 'User-Agent': `album-image/${packageInfo.version} ( https://github.com/foxxyz/album-image )` },
        signal,
    })
    const contents = await response.json()
    const { 'release-groups': releases } = contents
    return releases
}

export async function getImage({ id, signal }) {
    const response = await fetch(`https://coverartarchive.org/release-group/${id}`, { signal })
    // No image found for this release, try next
    if (response.status === 404) return
    // Rate limit exceeded
    if (response.status === 503) throw new Error('Rate limit exceeded!')
    // Invalid ID
    if (response.status === 400) throw new Error('ID not found!')
    const { images: [image] } = await response.json()
    return image.image
}

export async function getAlbumImage({ album, artist, signal }) {
    let releases = []
    if (artist) {
        releases = await getRelease({ album, artist, signal })
    }
    if (!releases.length) {
        releases = await getRelease({ album, signal })
    }

    if (!releases.length) {
        throw new Error('No matching release found!')
    }

    for (const release of releases) {
        const image = await getImage({ ...release, signal })
        if (image) return image
    }

    throw new Error('No cover art found!')
}

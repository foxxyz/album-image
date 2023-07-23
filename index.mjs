export async function getRelease({ album, artist }) {
    // Find correct release
    let query = `release:${album}`
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

export async function getAlbumImage({ album, artist }) {
    let releases = []
    if (artist) {
        releases = await getRelease({ album, artist })
    }
    if (!releases.length) {
        releases = await getRelease({ album })
    }

    if (!releases.length) {
        throw new Error('No matching release found!')
    }

    for (const release of releases) {
        const image = await getImage(release)
        if (image) return image
    }

    throw new Error('No cover art found!')
}

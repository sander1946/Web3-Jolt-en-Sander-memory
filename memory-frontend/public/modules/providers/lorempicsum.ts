export async function getImages(limit: number): Promise<any[]> {
    if (!limit) return Promise.reject('Limit is required');
    // the way it is set up, the limit api limit is not relevant
    // if (limit > 30) {
    //     limit = 30; // Limit to a maximum of 30 images, this is the api limit per page,
    // }

    let urls = [];
    try {
        for (let i = 0; i < limit; i++) {
            urls.push(`https://picsum.photos/500/500?random=${i}`);
        }
        const json = JSON.parse(JSON.stringify(urls));
        return json;
    } catch (error) {
        console.error('Error fetching Lorem Picsum images:', error);
        return Promise.reject('Error fetching Lorem Picsum images:' + error);
    }
}

export function getImageUrl(imageData: any): string {
    return imageData; // return the image URL directly
}

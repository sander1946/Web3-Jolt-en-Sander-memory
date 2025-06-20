export async function getImages(limit: number): Promise<any[]> {
    if (!limit) return Promise.reject('Limit is required');

    let urls = [];
    try {
        for (let i = 0; i < limit; i++) {
            urls.push(`https://picsum.photos/500/500?random=${i}`);
        }
        let json = JSON.parse(JSON.stringify(urls));
        return json;
    } catch (error) {
        console.error('Error fetching Lorem Picsum images:', error);
        return Promise.reject('Error fetching Lorem Picsum images:' + error);
    }
}

export function getImageUrl(imageData: any): string {
    return imageData; // return the image URL directly
}

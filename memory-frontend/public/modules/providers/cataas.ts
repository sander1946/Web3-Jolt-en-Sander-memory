export async function getImages(limit: number): Promise<any[]> {
    if (!limit) return Promise.reject('Limit is required');
    if (limit > 1950) {
        limit = 1950; // Limit to a maximum of 1950 images, this is the total number of images available
    }

    const url = `https://cataas.com/api/cats?limit=${limit}`;
    try {
        const response = await fetch(url, {
            credentials: 'omit'
        });
        let json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching cat images:', error);
        return Promise.reject('Error fetching cat images:' + error);
    }
}

export function getImageUrl(imageData: any): string {
    return `https://cataas.com/cat/${imageData.id}?width=500&height=500`; // Constructs image URL
}

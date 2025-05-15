export async function getImages(limit) {
    if (!limit) return Promise.reject('Limit is required');
    if (limit > 50) {
        limit = 50; // Limit to a maximum of 50 images, this is the api limit
    }

    const url = `https://dog.ceo/api/breeds/image/random/${limit}`;
    try {
        const response = await fetch(url, {
            credentials: 'omit'
        });
        let json = await response.json();
        return json.message;
    } catch (error) {
        console.error('Error fetching DogAPI images:', error);
        return Promise.reject('Error fetching DogAPI images:', error);
    }
}

export function getImageUrl(imageData) {
    return imageData; // return the image URL directly
}

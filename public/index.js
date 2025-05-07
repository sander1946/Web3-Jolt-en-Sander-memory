async function updateBoardSize(inputSelector) {
    const board = document.querySelector('#game-board');
    board.innerHTML = ''; // Clear the board before updating

    const catJson = await getCatImages(inputSelector.value, 0, 'cute');
    console.log(catJson); // TODO: remove this line in production

    if (!catJson || catJson.length === 0) {
        console.error('No cat images found');
        return;
    }

    var cards_unshuffled = [];
    for (let i = 0; i < catJson.length; i++) {
        cards_unshuffled.push(catJson[i].id);
        cards_unshuffled.push(catJson[i].id); // Duplicate each image ID for the matching game
    }

    console.log(cards_unshuffled); // TODO: remove this line in production

    // Shuffle the cards array to randomize the order of images
    // cards.sort(() => Math.random() - 0.1); // TODO: find better random sort algorithm

    cards = cards_unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    console.log(cards); // TODO: remove this line in production

    cards.forEach(function (cardId, index) {
        const imgUrl = `https://cataas.com/cat/${cardId}`;

        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-card-id', cardId);
        card.setAttribute('data-card-status', 'closed');
        card.setAttribute('imgurl', imgUrl);

        const cardImgBackground = document.createElement('div');
        cardImgBackground.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);
        cardImgBackground.classList.add('card-image');

        const cardImg = document.createElement('div');
        cardImg.setAttribute('style', `display: none; background-image: url('${imgUrl}');`);
        cardImg.classList.add('card-image');

        cardImgBackground.appendChild(cardImg);
        card.appendChild(cardImgBackground);
        card.addEventListener('click', function() {
            const cardStatus = card.getAttribute('data-card-status');
            const imgUrl = card.getAttribute('imgurl');
            if (cardStatus === 'closed') {
                card.setAttribute('data-card-status', 'open');
                cardImg.setAttribute('style', `display: block; background-image: url('${imgUrl}');`);
                cardImgBackground.setAttribute('style', `background-color: var(--card-img-background-color);`);
            } else {
                card.setAttribute('data-card-status', 'closed');
                cardImg.setAttribute('style', `display: none; background-image: url('${imgUrl}');`);
                cardImgBackground.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);
            }
        });
        board.appendChild(card);
    });
}

async function getCatImages(limit, skip, tags) {
    if (!limit) return Promise.reject('Limit is required');
    const skipParam = skip ? `&skip=${skip}`: ``;
    const tagsParam = tags ? `&tags=${tags}`: ``;

    const url = `https://cataas.com/api/cats?limit=${limit}${skipParam}${tagsParam}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return console.error('Error fetching cat images:', error);
    }
}
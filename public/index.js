async function updateBoardSize(inputSelector) {
    const board = document.querySelector('#game-board');
    board.innerHTML = ''; // Clear the board before updating

    const catJson = await getCatImages(inputSelector.value, 0, 'cute');
    console.log(catJson); // TODO: remove this line in production

    if (!catJson || catJson.length === 0) {
        console.error('No cat images found');
        return;
    }

    var cards = [];
    for (let i = 0; i < catJson.length; i++) {
        cards.push(catJson[i].id);
        cards.push(catJson[i].id); // Duplicate each image ID for the matching game
    }

    console.log(cards); // TODO: remove this line in production

    // Shuffle the cards array to randomize the order of images
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(function (cardId, index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-card-id', cardId);
        card.setAttribute('data-card-status', 'closed');

        const cardImg = document.createElement('img');
        const imgUrl = `https://cataas.com/cat/${cardId}`;
        cardImg.setAttribute('src', imgUrl);
        cardImg.setAttribute('alt', `catId ${cardId}`);
        cardImg.setAttribute('style', "display: none;");
        cardImg.classList.add('card-image');

        card.appendChild(cardImg);
        card.addEventListener('click', function() {
            const cardStatus = card.getAttribute('data-card-status');
            if (cardStatus === 'closed') {
                card.setAttribute('data-card-status', 'open');
                cardImg.setAttribute('style', "display: block;");
            } else {
                card.setAttribute('data-card-status', 'closed');
                cardImg.setAttribute('style', "display: none;");
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
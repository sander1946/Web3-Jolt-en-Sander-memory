let selected_card = null;
async function updateBoardSize(inputSelector) {
    selected_card = null;
    const board = document.querySelector('#game-board');
    board.innerHTML = ''; // Clear the board before updating

    const catJson = await getCatImages(inputSelector.value, 0, 'cute,funny');

    if (!catJson || catJson.length === 0) {
        console.error('No cat images found');
        return;
    }

    var cards_unshuffled = [];
    for (let i = 0; i < catJson.length; i++) {
        cards_unshuffled.push(catJson[i].id);
        cards_unshuffled.push(catJson[i].id); // Duplicate each image ID for the matching game
    }

    cards = cards_unshuffled
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    cards.forEach(function (cardId, index) {
        const imgUrl = `https://cataas.com/cat/${cardId}?width=500&height=500`;

        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-card-id', cardId);
        card.setAttribute('data-card-index', index);
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

                if (selected_card === null) {
                    selected_card = card;
                } else {
                    const selectedCardId = selected_card.getAttribute('data-card-id');
                    const currentCardId = card.getAttribute('data-card-id');
                    console.log('selectedCardId', selectedCardId);
                    console.log('currentCardId', currentCardId);
                    if (selectedCardId === currentCardId) {
                        setTimeout(() => {
                            selected_card.setAttribute('data-card-status', 'found');

                            card.setAttribute('data-card-status', 'found');
                            selected_card = null;
                        }, 500);
                    } else {
                        setTimeout(() => {
                            selected_card.setAttribute('data-card-status', 'closed');
                            const selected_card_img_background = selected_card.querySelector('.card-image');
                            selected_card_img_background.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);
                            const selected_card_img = selected_card_img_background.querySelector('.card-image');
                            selected_card_img.setAttribute('style', `display: none; background-image: url('${selected_card.getAttribute('imgurl')}');`);

                            card.setAttribute('data-card-status', 'closed');
                            cardImg.setAttribute('style', `display: none; background-image: url('${imgUrl}');`);
                            cardImgBackground.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);
                            selected_card = null;
                        }, 750);
                    }
                }
            } else {
                // If the card is already open, do nothing

                // TODO: remove old test code
                // card.setAttribute('data-card-status', 'closed');
                // cardImg.setAttribute('style', `display: none; background-image: url('${imgUrl}');`);
                // cardImgBackground.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);
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
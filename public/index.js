let selected_card = null;
async function updateBoardSize(inputSelector) {
    // preparing variables
    selected_card = null;
    const board = document.querySelector('#game-board');

    // setting input to one if it's lower then one
    if(inputSelector.value<=1) {
        inputSelector.value = 1;
    }

    board.innerHTML = ''; // Clear the board before updating
    const catJson = await getCatImages(inputSelector.value);

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

        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.setAttribute('data-card-id', cardId);
        cardContainer.setAttribute('data-card-index', index);
        cardContainer.setAttribute('data-card-status', 'closed');
        cardContainer.setAttribute('imgurl', imgUrl);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.classList.add('card-image');
        cardFront.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.classList.add('card-image');
        cardBack.setAttribute('style', `background-image: url('${imgUrl}');`);

        board.appendChild(cardContainer);
        cardContainer.appendChild(cardInner);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);

        cardContainer.addEventListener('click', function() {
            const cardStatus = cardContainer.getAttribute('data-card-status');
            if (cardStatus !== 'closed') {
                // If the card is already open or found, do nothing
                return;
            }

            cardContainer.setAttribute('data-card-status', 'open');

            if (selected_card === null) {
                // If no card is selected, set the current card as selected
                selected_card = cardContainer;
                return;
            }

            const selectedCardId = selected_card.getAttribute('data-card-id');
            const currentCardId = cardContainer.getAttribute('data-card-id');
            if (selectedCardId === currentCardId) {
                setTimeout(() => {
                    selected_card.setAttribute('data-card-status', 'found');
                    cardContainer.setAttribute('data-card-status', 'found');
                    selected_card = null;
                }, 500);
            } else {
                setTimeout(() => {
                    selected_card.setAttribute('data-card-status', 'closed');
                    cardContainer.setAttribute('data-card-status', 'closed');
                    selected_card = null;
                }, 750);
            }
        });
    });
}

const fake_input = document.createElement('input');
fake_input.value = 8;
window.onload = updateBoardSize(fake_input);

async function getCatImages(limit, skip, tags) {
    if (!limit) return Promise.reject('Limit is required');
    const skipParam = skip ? `&skip=${skip}`: ``;
    const tagsParam = tags ? `&tags=${tags}`: ``;

    const url = `https://cataas.com/api/cats?limit=${limit}${skipParam}${tagsParam}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching cat images:', error);
        return Promise.reject('Error fetching cat images:', error);
    }
}

function updateCardColor(colorInput) {
    const colorInputType = colorInput.getAttribute('data-card-status');
    switch (colorInputType) {
        case "closed": document.documentElement.style.setProperty('--card-closed-color', colorInput.value);
        case "open": document.documentElement.style.setProperty('--card-open-color', colorInput.value);
        case "found": document.documentElement.style.setProperty('--card-found-color', colorInput.value);
    }
}
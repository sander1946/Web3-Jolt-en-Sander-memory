import { Card } from './card.js';

export class Board {
    element: HTMLElement;
    cards: Card[];

    constructor(boardElement: HTMLElement) {
        this.element = boardElement;
        this.cards = [];
    }

    addCard(card: Card): void {
        this.cards.push(card);
        this.element.appendChild(card.element);
    }

    addCards(cards: Card[]): void {
        cards.forEach(card => {
            this.cards.push(card);
            this.element.appendChild(card.element);
        });
    }

    removeCard(card: Card): void {
        let index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
            card.remove();
        }
    }

    getCards(): Card[] {
        return this.cards;
    }

    getCardByIndex(index: string): Card | null {
        return this.cards.find(card => card.index === index) || null;
    }

    getCardByImageUrl(url: string): Card | null {
        return this.cards.find(card => card.imageUrl === url) || null;
    }

    clear(): void {
        this.cards.forEach(card => card.remove());
        this.cards = [];
    }
}
/// <reference lib="dom" />

export enum Status {
    closed = "closed",
    open = "open",
    found = "found",
}

export class Card {
    element: HTMLElement;
    imageUrl: string;
    index: string;
    pairedCard: Card | null = null;
    status: Status = Status.closed;

    constructor(imageUrl: string, index: string) {
        this.imageUrl = imageUrl;
        this.index = index;
        this.element = this.createCardElement();
    }

    createCardElement(): HTMLElement {
        const element = document.createElement('div');
        element.classList.add('card-container');
        element.setAttribute('data-card-index', this.index);
        element.setAttribute('data-card-status', this.status);
        element.setAttribute('data-card-imgurl', this.imageUrl);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.classList.add('card-image');
        cardFront.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.classList.add('card-image');
        cardBack.setAttribute('style', `background-image: url('${this.imageUrl}');`);

        element.appendChild(cardInner);
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);

        return element;
    }

    setStatus(status: Status): void {
        this.status = status;
        this.element.setAttribute('data-card-status', status);
    }

    getStatus(): Status {
        return this.status;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    setPairedCard(card: Card): void {
        this.pairedCard = card;
    }

    getPairedCard(): Card | null {
        return this.pairedCard;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }

    getIndex(): string {
        return this.index;
    }

    isPaired(): boolean {
        return this.pairedCard !== null;
    }

    isOpen(): boolean {
        return this.status === 'open';
    }

    isClosed(): boolean {
        return this.status === 'closed';
    }

    isFound(): boolean {
        return this.status === 'found';
    }

    addEventListener(event: any, callback: any): void { // i don't know what type to use here
        this.element.addEventListener(event, callback);
    }

    remove(): void {
        this.element.remove();
    }

    isLinked(card: Card): boolean {
        if (this.pairedCard === null) {
            return false;
        }
        return this.pairedCard === card;
    }

    open(): void {
        this.setStatus(Status.open);
    }

    close(): void {
        new Promise((resolve) => {
            setTimeout(() => {
                this.setStatus(Status.closed);
                resolve(true);
            }, 1000);
        });
    }

    found(): void {
        this.setStatus(Status.found);

        if (this.pairedCard) {
            this.pairedCard.setStatus(Status.found);
        } else {
            console.error("No paired card found");
        }
    }
}
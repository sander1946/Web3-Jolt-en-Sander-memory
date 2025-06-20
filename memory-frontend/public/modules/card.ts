/// <reference lib="dom" />

import { Game } from "./game.js";

export enum Status {
    Closed = "closed",
    Open = "open",
    Found = "found",
}

export class Card {
    element: HTMLElement;
    imageUrl: string;
    index: string;
    pairedCard: Card | null = null;
    status: Status = Status.Closed;
    private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private closeResolve: (() => void) | null = null;

    constructor(imageUrl: string, index: string) {
        this.imageUrl = imageUrl;
        this.index = index;
        this.element = this.createCardElement();
    }

    createCardElement(): HTMLElement {
        let element = document.createElement('div');
        element.classList.add('card-container');
        element.setAttribute('data-card-index', this.index);
        element.setAttribute('data-card-status', this.status);
        element.setAttribute('data-card-imgurl', this.imageUrl);

        let cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        let cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.classList.add('card-image');
        cardFront.setAttribute('style', `background-image: var(--card-img-closed-background-img);`);

        let cardBack = document.createElement('div');
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
        this.setStatus(Status.Open);
    }

    close(): void {
        // If a previous timeout exists, clear it and resolve immediately
        if (this.closeTimeoutId) {
            clearTimeout(this.closeTimeoutId);
            this.closeTimeoutId = null;
        }
        // If a previous resolve exists, resolve it
        if (this.closeResolve) {
            this.closeResolve();
            this.closeResolve = null;
        }

        new Promise<void>((resolve) => {
            this.closeResolve = () => {
                this.setStatus(Status.Closed);
                resolve();
                this.closeTimeoutId = null;
                this.closeResolve = null;
            };
            this.closeTimeoutId = setTimeout(() => {
                if (this.closeResolve) {
                    this.closeResolve();
                }
            }, Game.view_time * 1000);
        });
    }

    /**
     * Manually trigger the close action before the timeout expires.
     */
    triggerCloseNow(): void {
        if (this.closeTimeoutId) {
            clearTimeout(this.closeTimeoutId);
            this.closeTimeoutId = null;
        }
        if (this.closeResolve) {
            this.closeResolve();
            this.closeResolve = null;
        }
    }

    found(): void {
        this.setStatus(Status.Found);

        if (this.pairedCard) {
            this.pairedCard.setStatus(Status.Found);
        } else {
            console.error("No paired card found");
        }
    }
}
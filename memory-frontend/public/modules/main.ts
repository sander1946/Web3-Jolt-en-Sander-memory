export function showPopup(content: string): void {
    let popup = document.getElementById("popup");
    popup!.style.display = "block";
    let popup_content =  document.querySelector('.popup-content') as HTMLElement;
    popup_content.innerHTML = content;
}
export function showPopup(content: string): void {
    var popup = document.getElementById("popup");
    popup!.style.display = "block";
    var popup_content =  document.querySelector('.popup-content') as HTMLElement;
    popup_content.innerHTML = content;
}
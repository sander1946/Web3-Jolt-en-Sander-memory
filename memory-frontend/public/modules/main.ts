export function showPopup(content: string): void {
    let popup = document.getElementById("popup");
    popup!.style.display = "block";
    let popup_content =  document.querySelector('.popup-content') as HTMLElement;
    popup_content.innerHTML = content;
}

let headerWrapper = document.querySelector(".header-wrapper");
let loginA: HTMLAnchorElement | null = null;
let linkBox: HTMLElement | null = null;
let linkBoxText: HTMLElement | null = null;

if (headerWrapper) {
    loginA = headerWrapper.querySelector("a[href='/login']");
    if (loginA) {
        linkBox = loginA.querySelector(".link-box");
        if (linkBox) {
            linkBoxText = linkBox.querySelector("h2");
        }
    }
}

if (localStorage.getItem('token') && loginA && linkBox && linkBoxText) {
    loginA.href = '#';
    loginA.onclick = () => {
        localStorage.clear(); // Clear the token from localStorage
        if (document.location.pathname !== '/login') {
            document.location.href = '/login'; // Redirect to the home page after logout
        } else {
            document.location.reload(); // Reload the current page to reflect the logout
        }
    };
    linkBoxText.textContent = 'Logout';
}
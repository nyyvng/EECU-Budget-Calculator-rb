// @ts-check
const page_view = /** @type {HTMLDivElement} */ (document.querySelector('.current-page'));
const visible_page_counters = /** @type {NodeListOf<HTMLSpanElement>} */ (document.querySelectorAll('[class^=visible-page]'));
let current_page_number = 0;
const templates = [...document.querySelectorAll('template')];
const nextBtn = (document.querySelector('.next'));
const backBtn = (document.querySelector('.back'));

function next_page() {
    const fragment = templates[current_page_number++].content.cloneNode(true);
    page_view.replaceChildren(fragment);
    let number = current_page_number;
    for (const counter of visible_page_counters) {
        counter.textContent = `${number++}`;
    }
    console.log(templates);
    console.log(current_page_number);
}

function back_page() {
    const fragment = templates[current_page_number--].content.cloneNode(true);
    page_view.replaceChildren(fragment);
    let number = current_page_number;
    for (const counter of visible_page_counters) {
        counter.textContent = `${number++}`;
    }
    console.log(templates);
    console.log(current_page_number);
}

next_page();

nextBtn.addEventListener('click', next_page);
backBtn.addEventListener('click', back_page);


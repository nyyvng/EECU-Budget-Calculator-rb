
const page_view = document.getElementById('current-page');
let current_page_number = 0;
const templates = [...document.querySelectorAll('template')];

function render_page() {
    const fragment = templates[current_page_number].content.cloneNode(true);
    page_view.replaceChildren(fragment);
}
render_page();

const nextBtn = document.getElementsByClassName('next');
const backBtn = document.getElementsByClassName('back');
const clone = document.importNode(templates[0], true);
const job_selector = clone.querySelectorAll('#job-selector');
const grossIncome = page_view.querySelector('#gross-income');

const netIncome = document.getElementById('net-income');
const taxes = document.getElementById('taxes');
const studentLoans = document.getElementById('student-loans');
const housing = document.getElementById('housing');
const essentials = document.getElementById('essentials');
const lifestyle = document.getElementById('lifestyle');
const futureProofing = document.getElementById('future-proofing');


function next_page() {
    if (current_page_number >= templates.length - 1) return;

    current_page_number++;

    const page = document.getElementById(`visible-page-${current_page_number + 1}`);
    page.classList.add('blue');
    page.classList.remove('sky-blue');

    const pageTab = document.getElementById(`line-${current_page_number + 1}`);
    if (pageTab) {
        pageTab.classList.add('half');
        pageTab.classList.remove('none');
    }

    const pageTabPrior = document.getElementById(`line-${current_page_number}`);
    pageTabPrior.classList.add('full');
    pageTabPrior.classList.remove('half');

    render_page();
}

function back_page() {
    if (current_page_number <= 0) return;

    const page = document.getElementById(`visible-page-${current_page_number + 1}`);
    page.classList.add('sky-blue');
    page.classList.remove('blue');

    const pageTab = document.getElementById(`line-${current_page_number + 1}`);
    if (pageTab) {
        pageTab.classList.add('none');
        pageTab.classList.remove('half');
    }

    const pageTabPrior = document.getElementById(`line-${current_page_number}`);
    pageTabPrior.classList.add('half');
    pageTabPrior.classList.remove('full');

    current_page_number--;

    render_page();
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

async function careerSelect() {
    const selectElement = page_view.querySelector('#job-selector');
    const occupationSalaryMap = new Map();

    try {
        const response = await fetch('https://eecu-data-server.vercel.app/data');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const users = await response.json();

        users.forEach(user => {
            occupationSalaryMap.set(user["Occupation"], user["Salary"]);
            const option = new Option(user["Occupation"], user["Occupation"]);
            selectElement.add(option);
        });

        selectElement.addEventListener('change', () => {
            grossIncome.textContent = formatter.format(occupationSalaryMap.get(selectElement.value)) || 'Gross Income';
            console.log(parseFloat(grossIncome.textContent));
            taxCalculator(Number(Intl.NumberFormat(grossIncome.textContent)));
        });
    } catch (error) {
        console.error('Error populating user select:', error);
    }
}
careerSelect();

nextBtn[0].addEventListener('click', next_page);
backBtn[0].addEventListener('click', back_page);

function taxCalculator(money) {
    let taxTotal = 0;
    if (money <= 12400) {
        taxTotal = money * .1;
    } else if (money <=5040) {
        taxTotal = (money - 12400) * .12 + 1240;
    } else {
        taxTotal = (money - 50400) *.22 + 5800;
    }
    taxes.textContent = formatter.format(taxTotal);
    netIncome.textContent = formatter.format(Number(grossIncome.textContent) - taxTotal);
};
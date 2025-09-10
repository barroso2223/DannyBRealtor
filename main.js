document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
    });

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                bsCollapse.hide();
            }
        });
    });

    // Update hamburger icon state
    navbarCollapse.addEventListener('hidden.bs.collapse', () => {
        document.querySelector('.navbar-toggler').classList.remove('active');
    });

    navbarCollapse.addEventListener('shown.bs.collapse', () => {
        document.querySelector('.navbar-toggler').classList.add('active');
    });

    // --- AOS SCRIPT ---
    const cards = document.querySelectorAll('[data-aos], .responsive-aos');
    const isMobile = window.innerWidth <= 768; // Adjust this breakpoint if needed

    cards.forEach(card => {
        let desktopAos = card.getAttribute('data-desktop-aos');
        let mobileAos = card.getAttribute('data-mobile-aos');

        if (isMobile && mobileAos) {
            card.setAttribute('data-aos', mobileAos);
        } else if (desktopAos) {
            card.setAttribute('data-aos', desktopAos);
        }
    });

    // IMPORTANT: Now initialize AOS AFTER setting data-aos
    AOS.init({
        once: false, 
        mirror: true
    });

    AOS.refresh();

    // ScrollSpy
    var scrollSpy = new bootstrap.ScrollSpy(document.body, {
        target: '#navbarNav',
        offset: 50
    });

    // Navbar scroll class
    window.addEventListener('scroll', function () {
        var navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    
   const inputs = document.querySelectorAll('input, select');
    const totalMonthlyPaymentEl = document.getElementById('total-monthly-payment');
    const pAndIEl = document.getElementById('p-and-i');
    const monthlyTaxEl = document.getElementById('monthly-tax');
    const monthlyInsuranceEl = document.getElementById('monthly-insurance');
    const monthlyHoaEl = document.getElementById('monthly-hoa');
    const summaryDownPaymentEl = document.getElementById('summary-down-payment');
    const summaryLoanAmountEl = document.getElementById('summary-loan-amount');
    const summaryTotalInterestEl = document.getElementById('summary-total-interest');
    const payoffOutputEl = document.getElementById('payoff-output');
    // NEW ELEMENTS FOR EXTRA PAYMENT INTEREST SUMMARY
    const summaryTotalInterestWithExtraEl = document.getElementById('summary-total-interest-with-extra');
    const summaryItemTotalInterestWithExtraEl = document.getElementById('summary-item-total-interest-with-extra');

    // --- Helper Function ---
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    // --- Main Calculation ---
    function calculateMortgage() {
        // Get input values
        const homePrice = parseFloat(document.getElementById('home-price').value) || 0;
        const downPaymentPercent = parseFloat(document.getElementById('down-payment').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const loanTermYears = parseInt(document.getElementById('loan-term').value) || 0;
        
        const propertyTaxAnnual = parseFloat(document.getElementById('property-tax').value) || 0;
        const homeInsuranceAnnual = parseFloat(document.getElementById('home-insurance').value) || 0;
        const hoaFeeMonthly = parseFloat(document.getElementById('hoa-fee').value) || 0;
        
        // Core mortgage calculations
        const downPaymentAmount = homePrice * (downPaymentPercent / 100);
        const loanAmount = homePrice - downPaymentAmount;
        const monthlyInterestRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTermYears * 12;
        
        let monthlyPAndI = 0;
        if (loanAmount > 0 && monthlyInterestRate > 0) {
            monthlyPAndI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        } else if (loanAmount > 0) {
            monthlyPAndI = loanAmount / numberOfPayments;
        }

        const originalTotalInterest = (monthlyPAndI * numberOfPayments) - loanAmount;
        
        const monthlyPropertyTax = propertyTaxAnnual / 12;
        const monthlyInsurance = homeInsuranceAnnual / 12;
        const totalMonthlyPayment = monthlyPAndI + monthlyPropertyTax + monthlyInsurance + hoaFeeMonthly;

        // Update UI
        totalMonthlyPaymentEl.textContent = formatCurrency(totalMonthlyPayment);
        pAndIEl.textContent = formatCurrency(monthlyPAndI);
        monthlyTaxEl.textContent = formatCurrency(monthlyPropertyTax);
        monthlyInsuranceEl.textContent = formatCurrency(monthlyInsurance);
        monthlyHoaEl.textContent = formatCurrency(hoaFeeMonthly);
        summaryDownPaymentEl.textContent = formatCurrency(downPaymentAmount);
        summaryLoanAmountEl.textContent = formatCurrency(loanAmount);
        summaryTotalInterestEl.textContent = formatCurrency(originalTotalInterest > 0 ? originalTotalInterest : 0);

        // Pass original total interest to payoff calculator
        calculateEarlyPayoff(loanAmount, monthlyPAndI, monthlyInterestRate, numberOfPayments, originalTotalInterest);
    }
    
    // --- Early Payoff Calculation ---
    function calculateEarlyPayoff(loanAmount, monthlyPAndI, monthlyInterestRate, originalNumberOfPayments, originalTotalInterest) {
        const extraPayment = parseFloat(document.getElementById('extra-payment').value) || 0;
        const frequency = document.getElementById('payment-frequency').value;

        // Reset the extra interest summary display if no extra payment
        if (extraPayment <= 0 || loanAmount <= 0) {
            payoffOutputEl.innerHTML = '';
            summaryItemTotalInterestWithExtraEl.style.display = 'none'; // Hide the summary item
            summaryTotalInterestWithExtraEl.textContent = ''; // Clear its content
            return;
        }

        let equivalentMonthlyExtra = 0;
        if (frequency === 'monthly') equivalentMonthlyExtra = extraPayment;
        else if (frequency === 'bi-weekly') equivalentMonthlyExtra = extraPayment * 26 / 12;
        else if (frequency === 'yearly') equivalentMonthlyExtra = extraPayment / 12;

        let remainingBalance = loanAmount;
        let months = 0;
        let newTotalInterestPaid = 0;
        const totalMonthlyPaymentWithExtra = monthlyPAndI + equivalentMonthlyExtra;
        
        while (remainingBalance > 0) {
            const interestThisMonth = remainingBalance * monthlyInterestRate;
            if (totalMonthlyPaymentWithExtra <= interestThisMonth) {
                payoffOutputEl.innerHTML = `<p>Extra payment isn't enough to cover interest.</p>`;
                summaryItemTotalInterestWithExtraEl.style.display = 'none'; // Hide if not enough payment
                summaryTotalInterestWithExtraEl.textContent = '';
                return;
            }
            newTotalInterestPaid += interestThisMonth;
            remainingBalance -= (totalMonthlyPaymentWithExtra - interestThisMonth);
            months++;
            if (months > originalNumberOfPayments * 2) break; // Safety break
        }

        const yearsSaved = Math.floor((originalNumberOfPayments - months) / 12);
        const monthsSaved = (originalNumberOfPayments - months) % 12;
        const yearsPaid = Math.floor(months / 12);
        const monthsPaid = months % 12;

        const interestSaved = originalTotalInterest - newTotalInterestPaid;

        payoffOutputEl.innerHTML = `
            <p>Paid off in <strong>${yearsPaid} years, ${monthsPaid} months</strong> (saving ${yearsSaved} years, ${monthsSaved} months).</p>
            <p>Total interest saved: <span>${formatCurrency(interestSaved > 0 ? interestSaved : 0)}</span></p>
        `;

        // NEW: Update the new summary item
        summaryTotalInterestWithExtraEl.textContent = formatCurrency(newTotalInterestPaid > 0 ? newTotalInterestPaid : 0);
        summaryItemTotalInterestWithExtraEl.style.display = 'block'; // Show the summary item
    }

    // --- Event Listeners ---
    inputs.forEach(input => input.addEventListener('input', calculateMortgage));
    
    // Initial calculation on page load
    calculateMortgage();
});

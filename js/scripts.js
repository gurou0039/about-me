window.addEventListener('DOMContentLoaded', () => {
    const pages = Array.from(document.querySelectorAll('.page'));
    const buttons = Array.from(document.querySelectorAll('.page-button'));
    const counter = document.getElementById('page-counter');
    const book = document.querySelector('.book');
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let dragStartFromCenter = false;

    const renderPage = (index) => {
        pages.forEach((page, pageIndex) => {
            page.classList.remove('is-active', 'is-next', 'is-flipping');
            page.style.transform = '';
            page.style.opacity = '';
            page.style.transition = '';
            page.style.visibility = 'hidden';

            if (pageIndex === index) {
                page.classList.add('is-active');
                page.style.visibility = 'visible';
                page.style.opacity = '1';
            } else if (pageIndex === index + 1 && index + 1 < pages.length) {
                page.classList.add('is-next');
                page.style.visibility = 'visible';
            }
        });

        counter.textContent = `${index + 1} / ${pages.length}`;
        buttons[0].disabled = index === 0;
        buttons[1].disabled = index === pages.length - 1;
    };

    const goToPage = (nextIndex) => {
        if (nextIndex < 0 || nextIndex >= pages.length) {
            return;
        }

        const currentPage = pages[currentIndex];
        const nextPage = pages[nextIndex];

        currentPage.classList.add('is-flipping');
        nextPage.classList.add('is-next');
        nextPage.style.visibility = 'visible';
        nextPage.style.opacity = '1';
        currentPage.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.35s ease';

        window.setTimeout(() => {
            currentIndex = nextIndex;
            renderPage(currentIndex);
        }, 420);
    };

    const handleDrag = (clientX, clientY) => {
        if (!isDragging) {
            return;
        }

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
            return;
        }

        if (deltaX < 0 && currentIndex < pages.length - 1 && dragStartFromCenter) {
            const currentPage = pages[currentIndex];
            const progress = Math.min(1, Math.max(0, Math.abs(deltaX) / 360));
            const rotateY = -130 * progress;
            const translateX = -Math.abs(deltaX) * 0.75;

            currentPage.style.transition = 'none';
            currentPage.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg)`;
            currentPage.style.opacity = `${1 - progress * 0.15}`;

            const nextPage = pages[currentIndex + 1];
            if (nextPage) {
                nextPage.style.visibility = 'visible';
                nextPage.style.opacity = '1';
                nextPage.style.transform = `translateX(${Math.max(0, 18 - progress * 16)}px) scale(${0.98 + progress * 0.02})`;
            }
        }
    };

    const endDrag = (clientX, clientY) => {
        if (!isDragging) {
            return;
        }

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        const distance = Math.abs(deltaX);

        if (distance > 90 && deltaX < 0 && currentIndex < pages.length - 1 && dragStartFromCenter) {
            goToPage(currentIndex + 1);
        } else {
            renderPage(currentIndex);
        }

        isDragging = false;
        book.classList.remove('is-dragging');
        document.body.style.userSelect = '';
    };

    book.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) {
            return;
        }

        const currentPage = pages[currentIndex];
        if (!currentPage) {
            return;
        }

        const pageRect = currentPage.getBoundingClientRect();
        const pageCenterX = pageRect.left + pageRect.width / 2;
        dragStartFromCenter = event.clientX >= pageCenterX;

        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        book.classList.add('is-dragging');
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('pointermove', (event) => {
        handleDrag(event.clientX, event.clientY);
    });

    window.addEventListener('pointerup', (event) => {
        endDrag(event.clientX, event.clientY);
    });

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const direction = button.dataset.direction;
            const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
            goToPage(nextIndex);
        });
    });

    renderPage(currentIndex);
});


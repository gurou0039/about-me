const pages = [
  {
    id: 1,
    type: 'cover',
    title: '静かな書斎へ',
    body: '古い本の匂いがする午後。ゆっくりとページをめくりながら、静かな物語へと足を踏み入れてください。',
    image: '',
    imageAlt: '',
    caption: 'A quiet room filled with paper and light.',
    background: 'linear-gradient(135deg, #efe2c9, #d9b785)',
    textColor: '#2c241f'
  },
  {
    id: 2,
    type: 'opening',
    title: '扉',
    body: 'この本は、光の揺らぎとともに時間をほどいていく。ページの角をつかむたびに、少しずつ世界が開いていく。',
    image: 'assets/images/atelier.svg',
    imageAlt: '静かな部屋のイラスト',
    caption: 'The first door opens to a calm interior.',
    background: 'linear-gradient(135deg, #f9eed9, #e6cda7)',
    textColor: '#2c241f'
  },
  {
    id: 3,
    type: 'contents',
    title: '目次',
    body: '',
    image: '',
    imageAlt: '',
    caption: '',
    background: 'linear-gradient(135deg, #f4ebd8, #ddc59a)',
    textColor: '#2c241f'
  },
  {
    id: 4,
    type: 'text',
    title: '午後の光',
    body: '窓辺の光が薄い紙にやさしく触れ、部屋の奥まで静かな色を運んでいく。今日の暮らしの中に、もう一つの時間を差し込む。',
    image: '',
    imageAlt: '',
    caption: '',
    background: 'linear-gradient(135deg, #f2eadf, #e0c693)',
    textColor: '#2c241f'
  },
  {
    id: 5,
    type: 'image',
    title: '作品の記憶',
    body: '一枚の写真が、どんな気配を持っているのか。わたしたちはそれを見つめるだけで、思い出の輪郭を少しだけ確かめる。',
    image: 'assets/images/atelier.svg',
    imageAlt: '作品のイメージ画像',
    caption: 'A warm memory captured in a single frame.',
    background: 'linear-gradient(135deg, #ede2cf, #d7b074)',
    textColor: '#2c241f'
  },
  {
    id: 6,
    type: 'mixed',
    title: '紙と影',
    body: '影は常に揺れている。紙の上を歩くように、言葉はひとつずつ移っていく。',
    image: 'assets/images/atelier.svg',
    imageAlt: '紙の質感のあるイメージ',
    caption: 'Soft shadows and grainy texture.',
    background: 'linear-gradient(135deg, #f6ebda, #d7b47a)',
    textColor: '#2c241f'
  },
  {
    id: 7,
    type: 'quote',
    title: '引用',
    body: '「本は、静かな手つきで開かれるものだ。」',
    image: '',
    imageAlt: '',
    caption: 'A small quote to pause and read slowly.',
    background: 'linear-gradient(135deg, #f2e8d7, #d9ba81)',
    textColor: '#2c241f'
  },
  {
    id: 8,
    type: 'text',
    title: 'ひそかな旅路',
    body: '道の端で、誰かの足音がまだ遠くに残っている。だからこそ、今このページの上に立っている自分の足元が、少しだけ確かなものに見える。',
    image: '',
    imageAlt: '',
    caption: '',
    background: 'linear-gradient(135deg, #f0e4cd, #d4ae72)',
    textColor: '#2c241f'
  },
  {
    id: 9,
    type: 'text',
    title: '終わりの前に',
    body: 'ページをめくるたびに、新しい朝が少しだけ近づく。読者の手の温度は、いつも本の中に残っていく。',
    image: '',
    imageAlt: '',
    caption: '',
    background: 'linear-gradient(135deg, #f6ebdc, #d8b77b)',
    textColor: '#2c241f'
  },
  {
    id: 10,
    type: 'closing',
    title: '最終ページ',
    body: '本は閉じられても、読んだあとの気配は残る。次に開くときまで、静かな余韻を手のひらに置いておこう。',
    image: '',
    imageAlt: '',
    caption: '',
    background: 'linear-gradient(135deg, #f4e6d0, #d7b47c)',
    textColor: '#2c241f'
  },
  {
    id: 11,
    type: 'back-cover',
    title: '裏表紙',
    body: 'The book closes softly, as if holding a final breath.',
    image: '',
    imageAlt: '',
    caption: '',
    background: 'linear-gradient(135deg, #1c2230, #5f4b33)',
    textColor: '#f8efe0'
  }
];

const state = {
  currentPage: 0,
  direction: null,
  isDragging: false,
  isAnimating: false,
  dragStartX: 0,
  dragCurrentX: 0,
  dragProgress: 0,
  isSinglePage: true,
  isReadingMode: true,
  isTableOfContentsOpen: false,
  lastPointerId: null
};

const ui = {
  app: document.getElementById('app'),
  book: document.getElementById('book'),
  pageStage: document.getElementById('page-stage'),
  prevButton: document.getElementById('prev-button'),
  nextButton: document.getElementById('next-button'),
  pageStatus: document.getElementById('page-status'),
  pageInput: document.getElementById('page-input'),
  jumpButton: document.getElementById('jump-button'),
  tocButton: document.getElementById('toc-button'),
  fullscreenButton: document.getElementById('fullscreen-button'),
  prevHitArea: document.querySelector('.page-hit-area--previous'),
  nextHitArea: document.querySelector('.page-hit-area--next'),
  tocPanel: document.getElementById('table-of-contents'),
  tocList: document.getElementById('toc-list'),
  guidance: document.getElementById('guidance'),
  closeGuidanceButton: document.getElementById('close-guidance-button'),
  message: document.getElementById('message'),
  liveRegion: document.getElementById('live-region'),
  loading: document.getElementById('loading'),
  pageNumberLabel: document.getElementById('page-number-label')
};

let pageElements = [];
let rafId = null;
let activeTurn = null;

function createPages() {
  ui.pageStage.innerHTML = '';
  pageElements = [];
  pages.forEach((page, index) => {
    const pageEl = document.createElement('section');
    pageEl.className = 'page-surface page-standby';
    pageEl.dataset.pageIndex = String(index);
    pageEl.setAttribute('role', 'group');
    pageEl.setAttribute('aria-label', `ページ ${index + 1}`);
    pageEl.innerHTML = `
      <div class="page-contents">
        ${page.type === 'cover' ? '<p class="page-label">Cover</p>' : page.type === 'back-cover' ? '<p class="page-label">Back cover</p>' : page.type === 'contents' ? '<p class="page-label">Contents</p>' : '<p class="page-label">Chapter</p>'}
        <h1>${page.title}</h1>
        ${page.body ? `<p>${page.body}</p>` : ''}
        ${page.type === 'contents' ? `<div class="stack"><p class="meta">1. 静かな書斎へ</p><p class="meta">2. 扉</p><p class="meta">3. 目次</p><p class="meta">4. 午後の光</p><p class="meta">5. 作品の記憶</p></div>` : ''}
        ${page.type === 'quote' ? `<blockquote class="quote">${page.body}</blockquote>` : ''}
        ${page.image ? `<img class="page-image" src="${page.image}" alt="${page.imageAlt}" loading="lazy">` : ''}
        ${!page.image && page.type === 'image' ? '<div class="placeholder">Illustration</div>' : ''}
        ${page.caption ? `<p class="meta">${page.caption}</p>` : ''}
      </div>
    `;
    ui.pageStage.appendChild(pageEl);
    pageElements.push(pageEl);
  });

  renderBook();
}

function setPageStyles(pageEl, page) {
  pageEl.style.background = page.background || 'var(--paper)';
  pageEl.style.color = page.textColor || 'var(--ink)';
}

function renderBook() {
  const isSmall = window.innerWidth <= 860;
  state.isSinglePage = state.isReadingMode || isSmall;

  pageElements.forEach((element, index) => {
    const page = pages[index];
    element.classList.remove('page-active', 'page-front', 'page-back', 'page-flipping', 'page-standby', 'page-preview');
    element.style.transform = '';
    element.style.opacity = '';
    element.style.zIndex = '';
    element.style.display = '';
    setPageStyles(element, page);

    if (state.isReadingMode) {
      if (index === state.currentPage) {
        element.classList.add('page-active', 'page-front');
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.zIndex = '4';
        element.style.transform = 'rotateY(0deg)';
      } else {
        element.classList.add('page-standby');
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
      }
      return;
    }

    if (index === state.currentPage) {
      element.classList.add('page-active', 'page-front');
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      element.style.zIndex = '4';
      element.style.transform = 'rotateY(0deg)';
    } else if (state.isSinglePage) {
      if (index === state.currentPage + 1) {
        element.classList.add('page-active', 'page-back');
        element.style.visibility = 'visible';
        element.style.opacity = '0.2';
        element.style.zIndex = '2';
        element.style.transform = 'translateX(14px) scale(0.98)';
      } else {
        element.classList.add('page-standby');
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
      }
    } else {
      if (index === state.currentPage + 1) {
        element.classList.add('page-active', 'page-back');
        element.style.visibility = 'visible';
        element.style.opacity = '0.35';
        element.style.zIndex = '2';
        element.style.transform = 'translateX(12px) scale(0.985)';
      } else if (index === state.currentPage - 1) {
        element.classList.add('page-active', 'page-front');
        element.style.visibility = 'visible';
        element.style.opacity = '0.35';
        element.style.zIndex = '2';
        element.style.transform = 'translateX(-12px) scale(0.985)';
      } else {
        element.classList.add('page-standby');
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
      }
    }
  });

  updateNavigationState();
  announceCurrentPage();
}

function updateNavigationState() {
  ui.prevButton.disabled = state.currentPage <= 0;
  ui.nextButton.disabled = state.currentPage >= pages.length - 1;
  ui.pageStatus.textContent = `ページ ${state.currentPage + 1} / ${pages.length}`;
  if (ui.pageNumberLabel) {
    ui.pageNumberLabel.textContent = `${state.currentPage + 1}`;
  }
  ui.pageInput.value = String(state.currentPage + 1);
  ui.prevButton.setAttribute('aria-label', '前のページへ戻る');
  ui.nextButton.setAttribute('aria-label', '次のページへ進む');
}

function announceCurrentPage() {
  ui.liveRegion.textContent = `ページ ${state.currentPage + 1} を表示しています。`;
}

function showMessage(message) {
  ui.message.textContent = message;
  ui.message.classList.add('is-visible');
  clearTimeout(showMessage.timeoutId);
  showMessage.timeoutId = window.setTimeout(() => {
    ui.message.classList.remove('is-visible');
  }, 1800);
}

function showError(message) {
  console.error(message);
  showMessage(message);
}

function goToNextPage() {
  if (state.isAnimating || state.currentPage >= pages.length - 1) return;
  startPageTurn('next');
}

function goToPreviousPage() {
  if (state.isAnimating || state.currentPage <= 0) return;
  startPageTurn('previous');
}

function goToPage(pageNumber) {
  const target = Number(pageNumber);
  if (!Number.isInteger(target)) {
    showError('ページ番号は数字で入力してください。');
    return;
  }
  if (target < 1 || target > pages.length) {
    showError('ページ番号が範囲外です。');
    return;
  }
  const nextIndex = target - 1;
  if (nextIndex === state.currentPage) return;
  state.direction = nextIndex > state.currentPage ? 'next' : 'previous';
  state.currentPage = nextIndex;
  renderBook();
}

function startPageTurn(direction) {
  if (state.isAnimating) return;
  state.isAnimating = true;
  state.direction = direction;
  const currentEl = pageElements[state.currentPage];
  const targetIndex = direction === 'next' ? state.currentPage + 1 : state.currentPage - 1;
  if (targetIndex < 0 || targetIndex >= pages.length) {
    state.isAnimating = false;
    return;
  }
  const targetEl = pageElements[targetIndex];
  targetEl.classList.remove('page-standby');
  targetEl.classList.add('page-active', 'page-back', 'is-turning');
  targetEl.style.visibility = 'visible';
  targetEl.style.opacity = '1';
  targetEl.style.zIndex = '5';
  currentEl.classList.add('page-flipping', 'is-turning');
  currentEl.classList.remove('page-front');
  currentEl.classList.add('page-back');
  currentEl.style.zIndex = '6';
  currentEl.style.transformOrigin = direction === 'next' ? 'left center' : 'right center';
  currentEl.style.transform = direction === 'next'
    ? 'translateZ(2px) rotateY(-140deg)'
    : 'translateZ(2px) rotateY(140deg)';
  currentEl.style.boxShadow = 'inset -18px 0 24px rgba(0,0,0,0.16)';
  activeTurn = { currentEl, targetEl, targetIndex, direction };
  window.setTimeout(() => completePageTurn(), 650);
}

function completePageTurn() {
  if (!activeTurn) return;
  const { currentEl, targetEl, targetIndex } = activeTurn;
  state.currentPage = targetIndex;
  currentEl.classList.remove('page-flipping', 'page-back', 'is-turning');
  currentEl.classList.add('page-front');
  currentEl.style.transform = '';
  currentEl.style.boxShadow = '';
  targetEl.classList.remove('page-back', 'is-turning');
  targetEl.classList.add('page-front');
  targetEl.style.transform = 'rotateY(0deg)';
  currentEl.style.zIndex = '2';
  targetEl.style.zIndex = '4';
  activeTurn = null;
  state.isAnimating = false;
  renderBook();
}

function cancelPageTurn() {
  if (!activeTurn) return;
  const { currentEl, targetEl } = activeTurn;
  currentEl.classList.remove('page-flipping', 'is-turning');
  currentEl.style.transform = '';
  currentEl.style.boxShadow = '';
  if (targetEl) {
    targetEl.classList.remove('is-turning');
  }
  activeTurn = null;
  state.isAnimating = false;
  renderBook();
}

function handlePointerDown(event) {
  if (state.isAnimating || state.isTableOfContentsOpen) return;
  if (event.button !== 0 && event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
  const currentEl = pageElements[state.currentPage];
  if (!currentEl) return;
  const rect = currentEl.getBoundingClientRect();
  const isRightEdge = event.clientX >= rect.left + rect.width * 0.58;
  const isLeftEdge = event.clientX <= rect.left + rect.width * 0.42;
  if (!isRightEdge && !isLeftEdge) return;
  state.isDragging = true;
  state.dragStartX = event.clientX;
  state.dragCurrentX = event.clientX;
  state.dragProgress = 0;
  state.lastPointerId = event.pointerId;
  currentEl.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  if (!state.isDragging || state.isAnimating) return;
  if (event.pointerId !== state.lastPointerId) return;
  state.dragCurrentX = event.clientX;
  const delta = event.clientX - state.dragStartX;
  if (delta === 0) return;
  const direction = delta < 0 ? 'next' : 'previous';
  state.direction = direction;
  const currentEl = pageElements[state.currentPage];
  if (!currentEl) return;
  const pageWidth = currentEl.getBoundingClientRect().width || 320;
  const progress = Math.min(1, Math.max(0, Math.abs(delta) / pageWidth));
  state.dragProgress = progress;
  const rotateY = direction === 'next' ? -140 * progress : 140 * progress;
  currentEl.style.transform = `translateZ(2px) rotateY(${rotateY}deg)`;
  currentEl.style.opacity = `${1 - progress * 0.08}`;
  currentEl.style.boxShadow = direction === 'next'
    ? 'inset -18px 0 24px rgba(0,0,0,0.16)'
    : 'inset 18px 0 24px rgba(0,0,0,0.16)';
}

function handlePointerUp(event) {
  if (!state.isDragging) return;
  const delta = event.clientX - state.dragStartX;
  const shouldTurn = Math.abs(delta) > 110;
  if (shouldTurn) {
    if (delta < 0) {
      goToNextPage();
    } else {
      goToPreviousPage();
    }
  } else {
    cancelPageTurn();
  }
  state.isDragging = false;
  state.dragProgress = 0;
  state.lastPointerId = null;
}

function updateResponsiveMode() {
  if (window.innerWidth <= 860) {
    state.isSinglePage = true;
  } else {
    state.isSinglePage = false;
  }
  renderBook();
}

function openTableOfContents() {
  if (state.isTableOfContentsOpen) return;
  state.isTableOfContentsOpen = true;
  ui.tocPanel.classList.add('is-open');
  ui.tocPanel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  const firstButton = ui.tocList.querySelector('button');
  if (firstButton) firstButton.focus();
}

function closeTableOfContents() {
  if (!state.isTableOfContentsOpen) return;
  state.isTableOfContentsOpen = false;
  ui.tocPanel.classList.remove('is-open');
  ui.tocPanel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  ui.tocButton.focus();
}

async function enterBrowserFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.error('全画面表示を開始できませんでした。', error);
    showError('全画面表示を開始できませんでした。');
  }
}

async function exitBrowserFullscreen() {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.error('全画面表示を終了できませんでした。', error);
      showError('全画面表示を終了できませんでした。');
    }
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    enterBrowserFullscreen();
  } else {
    exitBrowserFullscreen();
  }
}

function updateFullscreenButtonLabel() {
  if (ui.fullscreenButton) {
    ui.fullscreenButton.textContent = document.fullscreenElement ? '通常表示' : '全画面';
  }
}

function attachEvents() {
  ui.prevButton.addEventListener('click', () => goToPreviousPage());
  ui.nextButton.addEventListener('click', () => goToNextPage());
  if (ui.prevHitArea) {
    ui.prevHitArea.addEventListener('click', () => goToPreviousPage());
  }
  if (ui.nextHitArea) {
    ui.nextHitArea.addEventListener('click', () => goToNextPage());
  }
  ui.jumpButton.addEventListener('click', () => goToPage(ui.pageInput.value));
  ui.tocButton.addEventListener('click', openTableOfContents);
  ui.fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenButtonLabel);
  ui.closeGuidanceButton.addEventListener('click', () => {
    ui.guidance.classList.add('is-hidden');
    localStorage.setItem('book-guide-dismissed', 'true');
  });
  ui.tocPanel.addEventListener('click', (event) => {
    if (event.target.classList.contains('toc-item')) {
      const pageIndex = Number(event.target.dataset.pageIndex);
      closeTableOfContents();
      goToPage(pageIndex + 1);
    }
  });
  ui.book.addEventListener('pointerdown', handlePointerDown);
  ui.book.addEventListener('pointermove', handlePointerMove);
  ui.book.addEventListener('pointerup', handlePointerUp);
  ui.book.addEventListener('pointercancel', handlePointerUp);
  window.addEventListener('resize', () => updateResponsiveMode());
  window.addEventListener('keydown', (event) => {
    if (ui.tocPanel.classList.contains('is-open')) {
      if (event.key === 'Escape') {
        closeTableOfContents();
      }
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNextPage();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPreviousPage();
    } else if (event.key === 'Escape') {
      ui.guidance.classList.add('is-hidden');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && ui.tocPanel.classList.contains('is-open')) {
      const focusable = ui.tocPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

function initTableOfContents() {
  ui.tocList.innerHTML = '';
  pages.forEach((page, index) => {
    const button = document.createElement('button');
    button.className = 'toc-item';
    button.dataset.pageIndex = String(index);
    button.type = 'button';
    button.textContent = `${index + 1}. ${page.title}`;
    if (index === state.currentPage) {
      button.classList.add('is-current');
    }
    ui.tocList.appendChild(button);
  });
}

function initGuidance() {
  const dismissed = localStorage.getItem('book-guide-dismissed');
  if (dismissed === 'true') {
    ui.guidance.classList.add('is-hidden');
  }
}

function init() {
  document.body.classList.add('reading-mode');
  document.body.classList.add('is-ready');
  createPages();
  initTableOfContents();
  initGuidance();
  attachEvents();
  updateResponsiveMode();
  updateFullscreenButtonLabel();
  ui.loading.classList.add('is-hidden');
}

window.addEventListener('DOMContentLoaded', init);

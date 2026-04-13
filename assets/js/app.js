const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const backToTop = document.getElementById('backToTop');
  const heroScrollNext = document.getElementById('heroScrollNext');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-nav-open');
  });

  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('mobile-nav-open'));
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.remove('opacity-0', 'pointer-events-none');
      backToTop.classList.add('opacity-100');
    } else {
      backToTop.classList.add('opacity-0', 'pointer-events-none');
      backToTop.classList.remove('opacity-100');
    }
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  heroScrollNext?.addEventListener('click', () => {
    document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const caseTabs = Array.from(document.querySelectorAll('[data-case-filter]'));
  const caseCards = Array.from(document.querySelectorAll('[data-case-category]'));

  function applyCaseFilter(category) {
    caseTabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.caseFilter === category));
    caseCards.forEach(card => {
      const match = category === 'all' || card.dataset.caseCategory === category;
      card.classList.toggle('hide', !match);
    });
  }

  caseTabs.forEach(tab => {
    tab.addEventListener('click', () => applyCaseFilter(tab.dataset.caseFilter));
  });

  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialSlides = Array.from(document.querySelectorAll('.testimonial-slide'));
  let testimonialIndex = 0;
  let testimonialInterval;

  function getVisibleTestimonials() {
    if (window.innerWidth >= 1280) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateTestimonialCarousel() {
    const visible = getVisibleTestimonials();
    const maxIndex = Math.max(0, testimonialSlides.length - visible);
    if (testimonialIndex > maxIndex) testimonialIndex = 0;
    const slideWidth = testimonialSlides[0] ? testimonialSlides[0].getBoundingClientRect().width : 0;
    testimonialTrack.style.transform = `translateX(-${testimonialIndex * slideWidth}px)`;
  }

  function nextTestimonials() {
    const visible = getVisibleTestimonials();
    const maxIndex = Math.max(0, testimonialSlides.length - visible);
    testimonialIndex = testimonialIndex >= maxIndex ? 0 : testimonialIndex + 1;
    updateTestimonialCarousel();
  }

  function prevTestimonials() {
    const visible = getVisibleTestimonials();
    const maxIndex = Math.max(0, testimonialSlides.length - visible);
    testimonialIndex = testimonialIndex <= 0 ? maxIndex : testimonialIndex - 1;
    updateTestimonialCarousel();
  }

  function startTestimonialAutoplay() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonials, 4000);
  }

  document.getElementById('testimonialPrev')?.addEventListener('click', () => { prevTestimonials(); startTestimonialAutoplay(); });
  document.getElementById('testimonialNext')?.addEventListener('click', () => { nextTestimonials(); startTestimonialAutoplay(); });
  window.addEventListener('resize', updateTestimonialCarousel);
  updateTestimonialCarousel();
  startTestimonialAutoplay();

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.getAttribute('data-open-modal'));
      modal?.classList.remove('hidden');
      modal?.classList.add('flex');
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.getAttribute('data-close-modal'));
      modal?.classList.add('hidden');
      modal?.classList.remove('flex');
    });
  });
  document.querySelectorAll('.modal-shell').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    });
  });

  function normalizeUrl(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function getScoreColor(score) {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  }

  function setBar(id, score) {
    const $bar = $(id);
    $bar.removeClass('bg-emerald-500 bg-amber-500 bg-rose-500').addClass(getScoreColor(score));
    $bar.css('width', `${Math.max(4, Math.min(score, 100))}%`);
  }

  
function buildSummary(scores) {
    const avg = Math.round((scores.seo + scores.accessibility + scores.structure + scores.technical) / 4);
    if (avg >= 90) return 'Tu sitio muestra una base muy sólida. El siguiente paso ideal es afinar mejoras puntuales para escalar conversión, SEO y experiencia.';
    if (avg >= 70) return 'El sitio tiene una buena base, pero ya hay señales claras de mejora técnica y de contenido que pueden generar impacto real.';
    if (avg >= 50) return 'Hay varias oportunidades claras de mejora. Con una auditoría bien guiada puedes lograr cambios visibles en experiencia y resultados.';
    return 'El análisis detecta oportunidades importantes. Conviene actuar pronto para que tu web transmita más confianza y logre mejores resultados.';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }

  function toAbsoluteUrl(input, base) {
    try {
      return new URL(input, base).href;
    } catch (e) {
      return null;
    }
  }

  async function fetchHtmlWithFallback(normalizedUrl) {
    const encoded = encodeURIComponent(normalizedUrl);
    const attempts = [
      {
        name: 'php-local',
        run: async () => {
          return await $.ajax({
            url: `analyzer.php?url=${encoded}`,
            method: 'GET',
            dataType: 'json',
            timeout: 25000
          }).then(response => response && response.html ? response.html : '');
        }
      },
      {
        name: 'allorigins-json',
        run: async () => {
          const response = await $.ajax({
            url: `https://api.allorigins.win/get?url=${encoded}`,
            method: 'GET',
            dataType: 'json',
            timeout: 20000
          });
          return response && response.contents ? response.contents : '';
        }
      },
      {
        name: 'allorigins-raw',
        run: async () => {
          return await $.ajax({
            url: `https://api.allorigins.win/raw?url=${encoded}`,
            method: 'GET',
            dataType: 'text',
            timeout: 20000
          });
        }
      },
      {
        name: 'jina-reader',
        run: async () => {
          const mirrored = `https://r.jina.ai/http://${normalizedUrl.replace(/^https?:\/\//, '')}`;
          return await $.ajax({
            url: mirrored,
            method: 'GET',
            dataType: 'text',
            timeout: 20000
          });
        }
      }
    ];

    let lastError = null;
    for (const attempt of attempts) {
      try {
        const response = await attempt.run();
        if (response && typeof response === 'string' && response.replace(/\s+/g, ' ').trim().length > 80) {
          return response;
        }
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('No se pudo obtener el HTML público del sitio.');
  }

  function analyzeHtml(normalizedUrl, html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title = (doc.querySelector('title')?.textContent || '').trim();
    const metaDescription = (doc.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim();
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const viewport = doc.querySelector('meta[name="viewport"]');
    const lang = doc.documentElement.getAttribute('lang') || '';
    const h1Count = doc.querySelectorAll('h1').length;
    const h2Count = doc.querySelectorAll('h2').length;
    const images = Array.from(doc.querySelectorAll('img'));
    const imagesWithoutAlt = images.filter(img => !String(img.getAttribute('alt') || '').trim()).length;
    const scripts = Array.from(doc.querySelectorAll('script'));
    const stylesheets = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    const externalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
      const absolute = toAbsoluteUrl(href, normalizedUrl);
      return absolute ? new URL(absolute).origin !== new URL(normalizedUrl).origin : false;
    }).length;
    const internalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
      const absolute = toAbsoluteUrl(href, normalizedUrl);
      return absolute ? new URL(absolute).origin === new URL(normalizedUrl).origin : href.startsWith('#');
    }).length;
    const schema = doc.querySelector('script[type="application/ld+json"]');
    const favicon = doc.querySelector('link[rel*="icon"]');
    const https = normalizedUrl.startsWith('https://');
    const text = (doc.body?.textContent || '').replace(/\s+/g, ' ').trim();
    const wordCount = text ? text.split(' ').length : 0;

    const seo = Math.max(0,
      (title ? 20 : 0) +
      (title.length >= 20 && title.length <= 60 ? 15 : 5) +
      (metaDescription ? 20 : 0) +
      (metaDescription.length >= 70 && metaDescription.length <= 160 ? 10 : (metaDescription ? 5 : 0)) +
      (canonical ? 10 : 0) +
      (h1Count === 1 ? 15 : (h1Count > 1 ? 6 : 0)) +
      (schema ? 10 : 0)
    );

    const accessibility = Math.max(0,
      (images.length === 0 ? 25 : Math.round(((images.length - imagesWithoutAlt) / Math.max(images.length, 1)) * 45)) +
      (viewport ? 20 : 0) +
      (lang ? 20 : 0) +
      ((internalLinks > 0 || externalLinks > 0) ? 15 : 0)
    );

    const structure = Math.max(0,
      (h1Count === 1 ? 30 : (h1Count > 1 ? 15 : 0)) +
      (h2Count >= 1 ? 20 : 0) +
      (wordCount >= 300 ? 20 : (wordCount >= 120 ? 10 : 0)) +
      (internalLinks >= 3 ? 15 : (internalLinks > 0 ? 8 : 0)) +
      (externalLinks >= 1 ? 10 : 0) +
      (favicon ? 5 : 0)
    );

    const technical = Math.max(0,
      (https ? 25 : 0) +
      (viewport ? 15 : 0) +
      (canonical ? 10 : 0) +
      (stylesheets.length <= 6 ? 15 : (stylesheets.length <= 10 ? 8 : 0)) +
      (scripts.length <= 12 ? 15 : (scripts.length <= 20 ? 8 : 0)) +
      (schema ? 10 : 0) +
      (favicon ? 10 : 0)
    );

    return {
      seo: Math.min(seo, 100),
      accessibility: Math.min(accessibility, 100),
      structure: Math.min(structure, 100),
      technical: Math.min(technical, 100),
      details: {
        titleLength: title.length,
        metaDescriptionLength: metaDescription.length,
        canonical: !!canonical,
        viewport: !!viewport,
        lang: lang || 'No definido',
        h1Count,
        h2Count,
        images: images.length,
        imagesWithoutAlt,
        scripts: scripts.length,
        stylesheets: stylesheets.length,
        internalLinks,
        externalLinks,
        wordCount,
        schema: !!schema,
        favicon: !!favicon,
        https
      }
    };
  }

  function renderListItems(selector, items) {
    $(selector).html(items.map(item => `<li class="flex items-start gap-3"><span class="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span><span>${escapeHtml(item)}</span></li>`).join(''));
  }

  function renderDetails(details) {
    const cards = [
      {
        label: 'Qué vemos',
        value: details.titleLength && details.metaDescriptionLength ? 'Tu web sí muestra información clave en buscadores.' : 'Tu web puede estar perdiendo visibilidad en buscadores.',
      },
      {
        label: 'Experiencia',
        value: details.viewport && details.imagesWithoutAlt === 0 ? 'La experiencia general luce bien encaminada.' : 'Hay detalles que pueden hacer que la experiencia se sienta menos clara o profesional.',
      },
      {
        label: 'Confianza',
        value: details.https && details.canonical ? 'La base transmite buena confianza técnica.' : 'Conviene reforzar señales técnicas que dan confianza al usuario y a Google.',
      },
      {
        label: 'Cómo ayudamos',
        value: 'Podemos convertir estos hallazgos en mejoras concretas para cargar mejor, posicionar mejor y vender mejor.',
      }
    ];

    $('#analysisDetails').html(cards.map(card => `
      <div class="rounded-2xl border border-primary/10 bg-white/65 px-4 py-4">
        <div class="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold mb-2">${escapeHtml(card.label)}</div>
        <div class="font-medium text-slate-700 leading-relaxed">${escapeHtml(card.value)}</div>
      </div>
    `).join(''));
  }

  function buildFindings(details) {
    const findings = [];
    if (!details.https) findings.push('La URL no usa HTTPS, lo que afecta confianza y señales técnicas básicas.');
    if (!details.titleLength) findings.push('No se detectó etiqueta title, una señal SEO crítica.');
    else if (details.titleLength < 20 || details.titleLength > 60) findings.push('El título existe, pero su longitud no parece óptima para resultados de búsqueda.');
    if (!details.metaDescriptionLength) findings.push('No se detectó meta description.');
    else if (details.metaDescriptionLength < 70 || details.metaDescriptionLength > 160) findings.push('La meta description existe, pero conviene ajustar su longitud.');
    if (details.h1Count === 0) findings.push('No se detectó H1 principal en el HTML público.');
    else if (details.h1Count > 1) findings.push('Se detectaron múltiples H1; conviene ordenar la jerarquía principal.');
    if (details.imagesWithoutAlt > 0) findings.push(`Hay ${details.imagesWithoutAlt} imágenes sin atributo alt.`);
    if (!details.viewport) findings.push('No se encontró meta viewport, clave para responsive.');
    if (!details.canonical) findings.push('No se detectó URL canónica.');
    if (!details.schema) findings.push('No se detectó marcado estructurado JSON-LD.');
    if (details.wordCount < 120) findings.push('El contenido visible parece escaso para una página principal o comercial.');
    if (!findings.length) findings.push('Se detecta una base técnica saludable en las señales visibles analizadas.');
    return findings.slice(0, 6);
  }

  

  function initScrollReveal() {
    const selectors = [
      'section > div > *',
      'section .grid > *',
      'section .flex > *',
      'section h1, section h2, section h3, section p',
      '.service-card',
      '.case-card',
      '.testimonial-slide',
      '.apple-glass',
      '.glass-strong',
      '.tilt-card',
      '.hero-scroll-btn',
      '.liquid-button',
      '.cases-tab',
      '#contacto form',
      '#contacto .apple-glass'
    ];

    const seen = new Set();
    const elements = [];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (seen.has(el) || el.closest('header.fixed') || el.closest('.testimonial-track')) return;
        seen.add(el);
        el.classList.add('scroll-reveal');
        if (!el.dataset.reveal) {
          const mod = index % 4;
          el.dataset.reveal = mod === 1 ? 'left' : mod === 2 ? 'right' : mod === 3 ? 'zoom' : 'soft';
        }
        if (!el.dataset.revealDelay) {
          el.dataset.revealDelay = String((index % 5) + 1);
        }
        elements.push(el);
      });
    });

    document.querySelectorAll('section').forEach((section, idx) => {
      if (seen.has(section)) return;
      seen.add(section);
      section.classList.add('scroll-reveal');
      section.dataset.reveal = idx % 2 === 0 ? 'soft' : 'zoom';
      section.dataset.revealDelay = '1';
      elements.push(section);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  $(function () {
    initScrollReveal();
    const $url = $('#analyzerUrl');
    const $button = $('#runAnalyzer');
    const $loading = $('#analyzerLoading');
    const $results = $('#analyzerResults');
    const $error = $('#analyzerError');

    function showError(message) {
      $error.text(message).removeClass('hidden');
    }

    function clearError() {
      $error.addClass('hidden').text('');
    }

    async function runAnalysis() {
      clearError();
      const normalizedUrl = normalizeUrl($url.val());

      if (!normalizedUrl) {
        showError('Ingresa una URL válida para iniciar el análisis.');
        return;
      }

      try {
        new URL(normalizedUrl);
      } catch (e) {
        showError('La URL no tiene un formato válido. Ejemplo: https://tuempresa.com');
        return;
      }

      $results.addClass('hidden');
      $loading.removeClass('hidden');
      $button.prop('disabled', true).addClass('opacity-70 cursor-not-allowed').text('Analizando...');

      try {
        const html = await fetchHtmlWithFallback(normalizedUrl);
        const analysis = analyzeHtml(normalizedUrl, html);
        const overall = Math.round((analysis.seo + analysis.accessibility + analysis.structure + analysis.technical) / 4);

        $('#analyzedUrlLabel').text(`Resultado para ${normalizedUrl.replace(/^https?:\/\//, '')}`);
        $('#analysisSummary').text(buildSummary(analysis));
        $('#overallScore').text(`${overall}/100`);
        $('#metricSeo').text(`${analysis.seo}/100`);
        $('#metricAccessibility').text(`${analysis.accessibility}/100`);
        $('#metricStructure').text(`${analysis.structure}/100`);
        $('#metricTechnical').text(`${analysis.technical}/100`);

        setBar('#barSeo', analysis.seo);
        setBar('#barAccessibility', analysis.accessibility);
        setBar('#barStructure', analysis.structure);
        setBar('#barTechnical', analysis.technical);

        renderListItems('#analysisFindings', buildFindings(analysis.details));
        renderDetails(analysis.details);

        $results.removeClass('hidden');
        $('html, body').animate({ scrollTop: $('#analyzer').offset().top - 90 }, 500);
      } catch (error) {
        showError('No pudimos leer esta web en este momento. Si tu hosting soporta PHP, esta versión del analizador puede hacerlo de forma más confiable desde el archivo analyzer.php. Si la web bloquea la lectura externa, te recomendamos una revisión asistida.');
      } finally {
        $loading.addClass('hidden');
        $button.prop('disabled', false).removeClass('opacity-70 cursor-not-allowed').text('Analizar Sitio');
      }
    }

    $button.on('click', runAnalysis);
    $url.on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        runAnalysis();
      }
    });
  });
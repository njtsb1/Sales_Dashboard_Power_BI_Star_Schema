(() => {
  const defaultLang = 'en';
  const supported = ['en','pt-BR','es'];
  const translations = {
    "en": {
      "brandTitle":"Sales Dashboard Power BI",
      "relational":"Relational Diagram",
      "star":"Star Schema",
      "intro":"This page shows the original relational model used as source for the dimensional design. Focus: Professor as the analysis subject.",
      "openStar":"Open Star Schema",
      "designRationale":"Design Rationale",
      "rationaleText":"The relational model contains core entities. For analytics focused on professors we will transform these into a star schema where the fact table captures teaching metrics and dimensions provide descriptive context.",
      "factTitle":"FactProfessorTeaching",
      "copySuccess":"Schema summary copied to clipboard."
    },
    "pt-BR": {
      "brandTitle":"Painel de Vendas Power BI",
      "relational":"Diagrama Relacional",
      "star":"Esquema Estrela",
      "intro":"Esta página mostra o modelo relacional original usado como fonte para o projeto dimensional. Foco: Professor como objeto de análise.",
      "openStar":"Abrir Esquema Estrela",
      "designRationale":"Justificativa de Projeto",
      "rationaleText":"O modelo relacional contém entidades principais. Para análises centradas em professores, transformaremos em um esquema em estrela onde a tabela fato captura métricas de ensino e dimensões fornecem contexto descritivo.",
      "factTitle":"FatoProfessorEnsino",
      "copySuccess":"Resumo do esquema copiado para a área de transferência."
    },
    "es": {
      "brandTitle":"Panel de Ventas Power BI",
      "relational":"Diagrama Relacional",
      "star":"Esquema Estrella",
      "intro":"Esta página muestra el modelo relacional original usado como fuente para el diseño dimensional. Enfoque: Profesor como objeto de análisis.",
      "openStar":"Abrir Esquema Estrella",
      "designRationale":"Razonamiento de Diseño",
      "rationaleText":"El modelo relacional contiene entidades principales. Para análisis centrados en profesores lo transformaremos en un esquema estrella donde la tabla de hechos captura métricas de enseñanza y las dimensiones proporcionan contexto descriptivo.",
      "factTitle":"HechosProfesorEnseñanza",
      "copySuccess":"Resumen del esquema copiado al portapapeles."
    }
  };

  // Elements
  const themeToggles = document.querySelectorAll('[id^="themeToggle"]');
  const themeIcons = document.querySelectorAll('[id^="themeIcon"]');
  const langBtns = document.querySelectorAll('[id^="langBtn"]');
  const langMenus = document.querySelectorAll('.lang-menu');
  const langItems = document.querySelectorAll('.lang-item');
  const body = document.body;

  // Load preferences
  const savedTheme = localStorage.getItem('ui-theme') || 'dark';
  const savedLang = localStorage.getItem('ui-lang') || defaultLang;

  // Apply theme
  function applyTheme(theme){
    if(theme === 'light'){
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      body.setAttribute('data-theme','light');
      themeIcons.forEach(svg => svg.innerHTML = sunPath());
      themeToggles.forEach(btn => btn.setAttribute('aria-pressed','false'));
    } else {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      body.setAttribute('data-theme','dark');
      themeIcons.forEach(svg => svg.innerHTML = moonPath());
      themeToggles.forEach(btn => btn.setAttribute('aria-pressed','true'));
    }
    localStorage.setItem('ui-theme', theme);
  }

  // Apply language
  function applyLang(lang){
    if(!supported.includes(lang)) lang = defaultLang;
    document.documentElement.lang = lang;
    body.setAttribute('data-lang', lang);
    localStorage.setItem('ui-lang', lang);

    // Replace visible strings (simple approach)
    const t = translations[lang];
    if(!t) return;

    // Titles and buttons
    document.querySelectorAll('.brand-title').forEach(el => el.textContent = t.brandTitle);
    document.querySelectorAll('.brand-sub').forEach(el => {
      if(el.textContent.toLowerCase().includes('relational') || el.textContent.toLowerCase().includes('relacional') || el.textContent.toLowerCase().includes('relacional')) {
        // keep existing
      }
    });

    // Intro text
    const intro = document.getElementById('introText') || document.getElementById('starIntro');
    if(intro) intro.textContent = t.intro;

    // Buttons
    document.querySelectorAll('.btn.primary').forEach(btn => {
      if(btn.href && btn.href.indexOf('star_schema') !== -1) btn.textContent = t.openStar;
      if(btn.id === 'exportBtn') btn.textContent = t.copySuccess ? 'Copy Schema Summary' : btn.textContent;
    });

    // Rationale
    const rationale = document.getElementById('rationale');
    if(rationale){
      rationale.querySelector('h4').textContent = t.designRationale || t.designRationale;
      rationale.querySelector('p').textContent = t.rationaleText;
    }

    // Fact title
    const factTitle = document.getElementById('factTitle');
    if(factTitle) factTitle.textContent = t.factTitle;

    // Update any other translatable nodes if present
  }

  // Icon paths
  function moonPath(){
    return '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />';
  }
  function sunPath(){
    return '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-width="1.2" stroke="currentColor" fill="none" />';
  }

  // Initialize UI
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  applyLang(savedLang);

  // Theme toggle handlers
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = localStorage.getItem('ui-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  // Language menu toggles
  langBtns.forEach((btn, idx) => {
    const menu = langMenus[idx] || document.getElementById('langMenu') || document.getElementById('langMenu2');
    btn.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if(menu) {
        menu.style.display = expanded ? 'none' : 'flex';
        menu.setAttribute('aria-hidden', String(expanded));
      }
    });
  });

  // Language selection
  langItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const lang = item.getAttribute('data-lang');
      applyLang(lang);
      // hide menus
      langMenus.forEach(m => { m.style.display = 'none'; m.setAttribute('aria-hidden','true'); });
      langBtns.forEach(b => b.setAttribute('aria-expanded','false'));
    });
  });

  // Small interactions
  const explainBtn = document.getElementById('explainBtn');
  if(explainBtn){
    explainBtn.addEventListener('click', () => {
      const r = document.getElementById('rationale');
      if(r) r.classList.toggle('hidden');
    });
  }

  const exportBtn = document.getElementById('exportBtn');
  if(exportBtn){
    exportBtn.addEventListener('click', async () => {
      const summary = buildSchemaSummary();
      try {
        await navigator.clipboard.writeText(summary);
        const notice = document.getElementById('copyNotice');
        if(notice){
          notice.textContent = translations[localStorage.getItem('ui-lang') || defaultLang].copySuccess;
          notice.classList.remove('hidden');
          setTimeout(()=> notice.classList.add('hidden'), 2500);
        }
      } catch(e){
        alert('Copy failed.'); // fallback
      }
    });
  }

  function buildSchemaSummary(){
    // Build a concise textual summary of the star schema for copying
    return [
      'FactProfessorTeaching: FactID, ProfessorID, CourseID, DisciplineID, DepartmentID, DateID, TeachingHours, CoursesTaughtCount, AvgCourseEnrollment, PublicationsCount, ResearchGrantsAmount, Salary, TenureStatus',
      'DimProfessor: ProfessorID, FullName, HireDate, Rank, Title, Gender, BirthDate, Email, DepartmentID',
      'DimDepartment: DepartmentID, DepartmentName, Campus, CoordinatorProfessorID',
      'DimCourse: CourseID, CourseName, Level, Credits, DepartmentID',
      'DimDiscipline: DisciplineID, DisciplineName, SemesterOffered, Credits',
      'DimResearch: GrantID, GrantAmount, GrantStartDate, GrantEndDate',
      'DimDate: DateID, Date, Day, Month, Quarter, Year, Semester, AcademicYear, CourseOfferingDate, CourseEndDate'
    ].join('\n');
  }

  // Keyboard accessibility: close language menu on Escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      langMenus.forEach(m => { m.style.display = 'none'; m.setAttribute('aria-hidden','true'); });
      langBtns.forEach(b => b.setAttribute('aria-expanded','false'));
    }
  });

  // Ensure focus outlines for keyboard users
  document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
  document.addEventListener('keydown', () => document.body.classList.remove('using-mouse'));
})();

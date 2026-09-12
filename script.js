const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];

const portfolioData = {
	projects: [
		{
			title: 'Prophets Stories – Quran',
			description: 'An educational web project that presents stories of the prophets mentioned in the Quran in a clear and engaging way. The website is designed to make the content easy to explore and provides a simple, modern, and user-friendly experience.',
			technologies: ['HTML', 'CSS', 'JavaScript'],
			image: './image/prophets-stories.png.jpeg',
			liveDemo: 'https://prophets-stories-web-1u78.bolt.host',
			github: ''
		}
	],
	certificates: [
		{ title: 'Artificial Intelligence Fundamentals', organization: 'IBM', date: '29 Mar 2026', pdf: './certificates/ibm-ai.pdf' },
		{ title: 'Hardware and Upgrade Support', organization: 'Cisco Networking Academy', date: '25 Mar 2026', pdf: './certificates/cisco-hardware.pdf' },
		{ title: 'التصميم بالذكاء الاصطناعي', organization: 'For9a', date: '8 Sep 2026', pdf: './certificates/for9a-ai.pdf' },
		{ title: 'Certificate of Completion', organization: 'HP LIFE', date: '9 Aug 2026', pdf: './certificates/hp-life.pdf' },
		{ title: 'International Computer Driving Licence - ICDL Base', organization: 'Edraak', date: '7 Sep 2026', pdf: './certificates/edraak-icdl.pdf' },
		{ title: '1 Million Prompters', organization: 'Dubai Centre for Artificial Intelligence', date: '', pdf: './image/youssef-fathy-abdel-hamid-certificate.pdf' }
	]
};

window.portfolioData = portfolioData;

const createLink = (className, href, label, ariaLabel) => {
		const link = document.createElement('a');
		link.className = className;
		link.href = href;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = label;
		if (ariaLabel) link.setAttribute('aria-label', ariaLabel);
		return link;
};

const renderProjects = () => {
	const grid = document.querySelector('#projects-grid');
	portfolioData.projects.forEach((project, index) => {
		const card = document.createElement('article');
		card.className = `project-card${index === 0 ? ' project-large' : ''} reveal`;
		card.innerHTML = `<div class="project-art project-image-wrap"><img class="project-image" src="${project.image}" alt="${project.title} project preview"><span class="image-overlay" aria-hidden="true"></span></div><div class="project-info"><div><p class="project-type">${String(index + 1).padStart(2, '0')} / Educational web project</p><h3>${project.title}</h3><p class="project-description">${project.description}</p><div class="project-tech">${project.technologies.map((technology) => `<span>${technology}</span>`).join('')}</div></div></div>`;
		const projectInfo = card.querySelector('.project-info');
		const arrow = createLink('round-arrow', project.liveDemo, '↗', `View ${project.title} live demo`);
		projectInfo.append(arrow);
		const demo = createLink('project-demo', project.liveDemo, 'Live Demo ↗');
		card.append(demo);
		if (project.github) card.append(createLink('project-demo project-github', project.github, 'GitHub ↗'));
		grid.append(card);
	});
};

const renderCertificates = () => {
	const grid = document.querySelector('#certificate-grid');
	portfolioData.certificates.forEach((certificate, index) => {
		const card = document.createElement('article');
		card.className = 'certificate-card';
		const preview = document.createElement('div');
		preview.className = `certificate-image pdf-preview${certificate.pdf ? '' : ' pdf-missing'}`;
		if (certificate.pdf) {
			const canvas = document.createElement('canvas');
			canvas.className = 'certificate-canvas';
			canvas.dataset.pdf = certificate.pdf;
			canvas.setAttribute('aria-label', `${certificate.title} certificate preview`);
			preview.append(canvas);
		}
		const status = document.createElement('span');
		status.className = 'preview-status';
		status.textContent = certificate.pdf ? 'Loading preview...' : 'PDF source not available';
		preview.append(status);
		const content = document.createElement('div');
		content.className = 'certificate-content';
		content.innerHTML = `<p class="certificate-label">Certificate ${String(index + 1).padStart(2, '0')}</p><h3>${certificate.title}</h3><div class="certificate-meta"><p><span>Issued by</span><strong>${certificate.organization}</strong></p><p><span>Date earned</span><strong>${certificate.date}</strong></p></div>`;
		if (certificate.pdf) {
			content.append(createLink('certificate-button', certificate.pdf, 'View Certificate ↗'));
		} else {
			const unavailable = document.createElement('button');
			unavailable.className = 'certificate-button';
			unavailable.type = 'button';
			unavailable.disabled = true;
			unavailable.textContent = 'View Certificate ↗';
			content.append(unavailable);
		}
		card.append(preview, content);
		grid.append(card);
	});
};

renderProjects();
renderCertificates();

const cvData = {
	name: 'Youssef Fathy Abdel Hamid',
	title: 'Web Developer',
	location: 'Beni Suef, Egypt',
	email: 'yousseffathyabdelhamid@gmail.com',
	phone: '01099980401',
	linkedin: 'https://www.linkedin.com/in/youssef-fathy-abd-elhamid-79460041?utm_source=share_via&utm_content=profile&utm_medium=member_android',
	summary: 'Passionate Web Developer and second-year student at WE Applied Technology School, interested in web development, artificial intelligence, and modern digital technologies. Continuously developing my technical skills through hands-on projects, courses, and certifications, with a strong interest in turning ideas into useful digital solutions.',
	education: 'WE Applied Technology School - Second Year Student',
	skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Web Design', 'Web Development', 'Git & GitHub', 'Artificial Intelligence Fundamentals', 'AI Tools', 'Prompt Engineering', 'Microsoft Excel', 'Computer Fundamentals', 'Hardware & PC Support'],
	certifications: [
		'Artificial Intelligence Fundamentals - IBM (29 Mar 2026)',
		'Hardware and Upgrade Support - Cisco Networking Academy (25 Mar 2026)',
		'التصميم بالذكاء الاصطناعي - For9a (8 Sep 2026)',
		'Certificate of Completion - HP LIFE (9 Aug 2026)',
		'International Computer Driving Licence - ICDL Base - Edraak (7 Sep 2026)'
	],
	project: 'Prophets Stories - Quran | https://prophets-stories-web-1u78.bolt.host'
};

const downloadCv = () => {
	if (!window.jspdf) return;
	const { jsPDF } = window.jspdf;
	const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
	const margin = 48;
	const pageWidth = pdf.internal.pageSize.getWidth();
	const contentWidth = pageWidth - margin * 2;
	let y = 52;

	const addText = (text, size = 10, color = [40, 48, 62], weight = 'normal', gap = 15) => {
		pdf.setFont('helvetica', weight);
		pdf.setFontSize(size);
		pdf.setTextColor(...color);
		const lines = pdf.splitTextToSize(text, contentWidth);
		pdf.text(lines, margin, y);
		y += lines.length * (size + 3) + gap;
	};
	const addHeading = (text) => {
		y += 7;
		pdf.setDrawColor(26, 184, 214);
		pdf.setLineWidth(1);
		pdf.line(margin, y, pageWidth - margin, y);
		y += 18;
		addText(text.toUpperCase(), 10, [0, 137, 165], 'bold', 11);
	};
	const addLinkedIn = (url) => {
		pdf.setFont('helvetica', 'normal');
		pdf.setFontSize(9);
		pdf.setTextColor(0, 137, 165);
		pdf.textWithLink(url, margin, y, { url });
		y += 13;
	};
	const keepSpace = (height) => {
		if (y + height > 780) { pdf.addPage(); y = 52; }
	};

	pdf.setFont('helvetica', 'bold');
	pdf.setFontSize(24);
	pdf.setTextColor(15, 28, 48);
	pdf.text(cvData.name, margin, y);
	y += 25;
	addText(cvData.title, 12, [0, 137, 165], 'bold', 8);
	addText(`${cvData.location}  |  ${cvData.email}  |  ${cvData.phone}`, 9, [85, 96, 112], 'normal', 4);
	addLinkedIn(cvData.linkedin);

	addHeading('Professional Summary');
	addText(cvData.summary, 10, [40, 48, 62], 'normal', 4);
	addHeading('Education');
	addText(cvData.education, 10, [40, 48, 62], 'bold', 4);
	addHeading('Skills');
	addText(cvData.skills.join('  |  '), 10, [40, 48, 62], 'normal', 4);
	addHeading('Certifications');
	cvData.certifications.forEach((certificate) => { keepSpace(28); addText(certificate, 10, [40, 48, 62], 'normal', 2); });
	addHeading('Projects');
	keepSpace(42);
	addText('Prophets Stories - Quran', 10, [40, 48, 62], 'bold', 2);
	addText('Educational web project presenting stories of the prophets mentioned in the Quran in a clear, engaging, and user-friendly experience.', 10, [40, 48, 62], 'normal', 2);
	addText('Live Demo: https://prophets-stories-web-1u78.bolt.host', 9, [0, 137, 165], 'normal', 4);
	addHeading('Experience');
	addText('Currently building experience through personal projects, courses, certifications, and continuous learning.', 10, [40, 48, 62], 'normal', 2);

	pdf.save('Youssef-Fathy-Abdel-Hamid-CV.pdf');
};

document.querySelector('.download-cv')?.addEventListener('click', downloadCv);

const renderCertificatePreviews = async () => {
	if (!window.pdfjsLib) {
		document.querySelectorAll('.pdf-preview').forEach((frame) => {
			frame.classList.add('pdf-error');
			frame.querySelector('.preview-status').textContent = 'PDF preview unavailable';
		});
		return;
	}
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
	const canvases = [...document.querySelectorAll('.certificate-canvas')];
	await Promise.all(canvases.map(async (canvas) => {
		const frame = canvas.closest('.certificate-image');
		try {
			const pdf = await pdfjsLib.getDocument(canvas.dataset.pdf).promise;
			const page = await pdf.getPage(1);
			const baseViewport = page.getViewport({ scale: 1 });
			const maxWidth = frame.clientWidth - 28;
			const maxHeight = frame.clientHeight - 28;
			const scale = Math.min(maxWidth / baseViewport.width, maxHeight / baseViewport.height);
			const viewport = page.getViewport({ scale });
			const deviceScale = window.devicePixelRatio || 1;
			canvas.width = Math.floor(viewport.width * deviceScale);
			canvas.height = Math.floor(viewport.height * deviceScale);
			canvas.style.width = `${viewport.width}px`;
			canvas.style.height = `${viewport.height}px`;
			await page.render({ canvasContext: canvas.getContext('2d'), viewport, transform: deviceScale !== 1 ? [deviceScale, 0, 0, deviceScale, 0, 0] : null }).promise;
			frame.classList.add('pdf-ready');
		} catch (error) {
			frame.classList.add('pdf-error');
			frame.querySelector('.preview-status').textContent = 'Preview unavailable';
			console.error(`Could not render ${canvas.dataset.pdf}`, error);
		}
	}));
};

window.addEventListener('load', renderCertificatePreviews);

const storedTheme = localStorage.getItem('portfolio-theme');
if (storedTheme === 'light') {
	body.classList.add('light-mode');
	themeIcon.textContent = '☾';
	themeToggle.setAttribute('aria-label', 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
	const isLight = body.classList.toggle('light-mode');
	themeIcon.textContent = isLight ? '☾' : '☼';
	themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
	localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
});

menuToggle.addEventListener('click', () => {
	const isOpen = navigation.classList.toggle('open');
	menuToggle.setAttribute('aria-expanded', String(isOpen));
	menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach((link) => {
	link.addEventListener('click', () => {
		navigation.classList.remove('open');
		menuToggle.setAttribute('aria-expanded', 'false');
		menuToggle.setAttribute('aria-label', 'Open navigation');
	});
});

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) entry.target.classList.add('visible');
	});
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
	});
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

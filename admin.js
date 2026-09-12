if (!window.__portfolioAdminInitialized) {
	window.__portfolioAdminInitialized = true;
	(() => {
		const supabase = window.supabaseClient;

const currentPortfolio = {
	projects: [{
		title: 'Prophets Stories – Quran',
		description: 'An educational web project that presents stories of the prophets mentioned in the Quran in a clear and engaging way. The website is designed to make the content easy to explore and provides a simple, modern, and user-friendly experience.',
		technologies: ['HTML', 'CSS', 'JavaScript'],
		image_url: './image/prophets-stories.png.jpeg',
		live_demo_url: 'https://prophets-stories-web-1u78.bolt.host',
		github_url: '',
		sort_order: 0,
		is_published: true
	}],
	certificates: [
		{ title: 'Artificial Intelligence Fundamentals', organization: 'IBM', date: '29 Mar 2026', file_url: './certificates/ibm-ai.pdf', sort_order: 0, is_published: true },
		{ title: 'Hardware and Upgrade Support', organization: 'Cisco Networking Academy', date: '25 Mar 2026', file_url: './certificates/cisco-hardware.pdf', sort_order: 1, is_published: true },
		{ title: 'التصميم بالذكاء الاصطناعي', organization: 'For9a', date: '8 Sep 2026', file_url: './certificates/for9a-ai.pdf', sort_order: 2, is_published: true },
		{ title: 'Certificate of Completion', organization: 'HP LIFE', date: '9 Aug 2026', file_url: './certificates/hp-life.pdf', sort_order: 3, is_published: true },
		{ title: 'International Computer Driving Licence - ICDL Base', organization: 'Edraak', date: '7 Sep 2026', file_url: './certificates/edraak-icdl.pdf', sort_order: 4, is_published: true },
		{ title: '1 Million Prompters', organization: 'Dubai Centre for Artificial Intelligence', date: '', file_url: './image/youssef-fathy-abdel-hamid-certificate.pdf', sort_order: 5, is_published: true }
	]
};

const $ = (id) => document.getElementById(id);
const authPanel = $('auth-panel');
const dashboard = $('dashboard');
const loginMessage = $('login-message');
const dashboardMessage = $('dashboard-message');

const setMessage = (element, message, error = false) => {
	element.textContent = message;
	element.classList.toggle('error', error);
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const safeUrl = (value = '') => /^(https?:\/\/|\.\/|\.\.\/|\/)/i.test(String(value)) ? String(value) : '';

const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']);

const getRemoteFileType = async (url, declaredType = '') => {
	const normalizedType = String(declaredType).split(';')[0].trim().toLowerCase();
	if (imageMimeTypes.has(normalizedType)) return 'image';
	if (normalizedType === 'application/pdf') return 'pdf';
	try {
		const response = await fetch(url, { cache: 'no-store' });
		const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
		if (imageMimeTypes.has(contentType)) return 'image';
		if (contentType === 'application/pdf') return 'pdf';
	} catch (error) {
		console.warn(`Could not determine file type for ${url}`, error);
	}
	return 'unknown';
};

const renderFilePreview = async (previewId, url = '', label = 'Current file') => {
	const preview = $(previewId);
	preview.replaceChildren();
	preview.hidden = !url;
	if (!url) return;
	if (await getRemoteFileType(url) === 'image') {
		const image = document.createElement('img');
		image.src = url;
		image.alt = label;
		preview.append(image);
		return;
	}
	const link = document.createElement('a');
	link.href = url;
	link.target = '_blank';
	link.rel = 'noopener';
	link.textContent = `Open ${label.toLowerCase()}`;
	preview.append(link);
};

const previewSelectedFile = (inputId, previewId, label) => {
	const file = $(inputId).files[0];
	if (!file) return;
	const preview = $(previewId);
	preview.replaceChildren();
	preview.hidden = !file.type.startsWith('image/');
	if (preview.hidden) return;
	const image = document.createElement('img');
	image.src = URL.createObjectURL(file);
	image.alt = label;
	preview.append(image);
};

const requireAdmin = async () => {
	const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
	if (sessionError) throw new Error(`Could not read the Auth session: ${sessionError.message}`);
	const session = sessionData.session;
	if (!session?.user?.id) throw new Error('Supabase Auth returned no session. Check the email, password, and email confirmation setting.');

	const { data: adminRecord, error: adminError } = await supabase
		.from('admin_users')
		.select('user_id')
		.eq('user_id', session.user.id)
		.maybeSingle();
	if (adminError) {
		console.error('Admin authorization query failed', { userId: session.user.id, error: adminError });
		throw new Error(`The session is valid, but admin authorization could not be read. Check the admin_users RLS policy: ${adminError.message}`);
	}
	if (!adminRecord) {
		console.warn('Authenticated user is not in public.admin_users', session.user.id);
		throw new Error(`Signed in successfully, but this user is not an admin. Add this User UID to public.admin_users: ${session.user.id}`);
	}
	return session;
};

const showDashboard = async () => {
	const session = await requireAdmin();
	await refreshRecords();
	authPanel.hidden = true;
	dashboard.hidden = false;
	setMessage(loginMessage, '');
	if (window.location.hash === '#projects') {
		resetForm('project-form');
		$('project-form').hidden = false;
		$('project-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
	return session;
};

const getFileUrl = (bucket, path) => supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

const uploadFile = async (bucket, file) => {
	if (!file) return null;
	if (!file.type || (!file.type.startsWith('image/') && file.type !== 'application/pdf')) throw new Error('Choose a valid JPG, JPEG, PNG, WEBP, SVG, or PDF file.');
	const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
	const path = `${crypto.randomUUID()}-${safeName}`;
	const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type || undefined });
	if (error) throw error;
	return getFileUrl(bucket, path);
};

const renderProjects = (projects) => {
	$('projects-list').innerHTML = projects.length ? projects.map((project) => `<article class="record"><div><h3>${escapeHtml(project.title)}</h3><p>Order ${Number(project.sort_order) || 0} · ${project.is_published ? 'Published' : 'Hidden'} · ${escapeHtml((project.technologies || []).join(', '))}</p>${safeUrl(project.image_url) ? `<a class="file-link" href="${escapeHtml(safeUrl(project.image_url))}" target="_blank" rel="noopener">Open image</a>` : ''}</div><div class="record-actions"><button class="secondary-button edit-project" data-id="${escapeHtml(project.id)}" type="button">Edit</button><button class="secondary-button danger-button delete-project" data-id="${escapeHtml(project.id)}" type="button">Delete</button></div></article>`).join('') : '<p class="muted">No projects yet.</p>';
};

const renderCertificates = (certificates) => {
	$('certificates-list').innerHTML = certificates.length ? certificates.map((certificate) => `<article class="record"><div><h3>${escapeHtml(certificate.title)}</h3><p>${escapeHtml(certificate.organization)} · Order ${Number(certificate.sort_order) || 0} · ${certificate.is_published ? 'Published' : 'Hidden'}</p>${safeUrl(certificate.file_url) ? `<a class="file-link" href="${escapeHtml(safeUrl(certificate.file_url))}" target="_blank" rel="noopener">Open file</a>` : ''}</div><div class="record-actions"><button class="secondary-button edit-certificate" data-id="${escapeHtml(certificate.id)}" type="button">Edit</button><button class="secondary-button danger-button delete-certificate" data-id="${escapeHtml(certificate.id)}" type="button">Delete</button></div></article>`).join('') : '<p class="muted">No certificates yet.</p>';
};

let projects = [];
let certificates = [];

const refreshRecords = async () => {
	const [{ data: projectData, error: projectsError }, { data: certificateData, error: certificatesError }] = await Promise.all([
		supabase.from('projects').select('*').order('sort_order').order('created_at'),
		supabase.from('certificates').select('*').order('sort_order').order('created_at')
	]);
	if (projectsError || certificatesError) throw projectsError || certificatesError;
	projects = projectData || [];
	certificates = certificateData || [];
	renderProjects(projects);
	renderCertificates(certificates);
};

const resetForm = (formId) => {
	$(formId).reset();
	$(formId).hidden = true;
	$(`${formId === 'project-form' ? 'project-id' : 'certificate-id'}`).value = '';
	renderFilePreview(formId === 'project-form' ? 'project-image-preview' : 'certificate-image-preview');
};

const fillProjectForm = (project) => {
	$('project-id').value = project.id;
	$('project-title').value = project.title || '';
	$('project-description').value = project.description || '';
	$('project-technologies').value = (project.technologies || []).join(', ');
	$('project-live-demo').value = project.live_demo_url || '';
	$('project-github').value = project.github_url || '';
	$('project-order').value = project.sort_order || 0;
	$('project-published').checked = project.is_published;
	renderFilePreview('project-image-preview', project.image_url, 'Current project image');
	$('project-form').hidden = false;
	$('project-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const fillCertificateForm = (certificate) => {
	$('certificate-id').value = certificate.id;
	$('certificate-title').value = certificate.title || '';
	$('certificate-organization').value = certificate.organization || '';
	$('certificate-date').value = certificate.date || '';
	$('certificate-verification').value = certificate.verification_url || '';
	$('certificate-order').value = certificate.sort_order || 0;
	$('certificate-published').checked = certificate.is_published;
	renderFilePreview('certificate-image-preview', certificate.file_url, 'Current certificate file');
	$('certificate-form').hidden = false;
	$('certificate-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
};

$('login-form').addEventListener('submit', async (event) => {
	event.preventDefault();
	const submitButton = $('login-form').querySelector('button[type="submit"]');
	submitButton.disabled = true;
	setMessage(loginMessage, 'Signing in...');
	try {
		const { data, error } = await supabase.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
		if (error) {
			const status = error.status ?? 'unknown';
			setMessage(loginMessage, `Supabase Auth error\nmessage: ${error.message}\nstatus: ${status}`, true);
			console.error('Supabase signInWithPassword failed', { message: error.message, status: error.status, code: error.code, name: error.name });
			return;
		}
		if (!data.session) throw new Error('Sign in returned no session. Confirm the user email in Supabase Authentication.');
		await showDashboard();
	} catch (error) {
		console.error('Admin login failed', error);
		setMessage(loginMessage, error.message || 'Sign in failed. Check the Supabase project settings.', true);
	} finally {
		submitButton.disabled = false;
	}
});

$('logout-button').addEventListener('click', async () => { await supabase.auth.signOut(); window.location.reload(); });
$('new-project-button').addEventListener('click', () => { resetForm('project-form'); $('project-form').hidden = false; });
$('new-certificate-button').addEventListener('click', () => { resetForm('certificate-form'); $('certificate-form').hidden = false; });

document.querySelectorAll('.cancel-editor').forEach((button) => button.addEventListener('click', () => resetForm(button.dataset.form)));
$('project-image').addEventListener('change', () => previewSelectedFile('project-image', 'project-image-preview', 'Selected project image'));
$('certificate-file').addEventListener('change', () => previewSelectedFile('certificate-file', 'certificate-image-preview', 'Selected certificate image'));

$('project-form').addEventListener('submit', async (event) => {
	event.preventDefault();
	try {
		setMessage(dashboardMessage, 'Saving project...');
		const id = $('project-id').value;
		const existing = projects.find((project) => project.id === id);
		const imageUrl = await uploadFile('project-images', $('project-image').files[0]);
		const payload = {
			title: $('project-title').value.trim(), description: $('project-description').value.trim(),
			technologies: $('project-technologies').value.split(',').map((item) => item.trim()).filter(Boolean),
			image_url: imageUrl || existing?.image_url || null, live_demo_url: $('project-live-demo').value.trim() || null,
			github_url: $('project-github').value.trim() || null, sort_order: Number($('project-order').value) || 0,
			is_published: $('project-published').checked
		};
		const query = id ? supabase.from('projects').update(payload).eq('id', id) : supabase.from('projects').insert(payload);
		const { error } = await query;
		if (error) throw error;
		resetForm('project-form'); await refreshRecords(); setMessage(dashboardMessage, 'Project saved.');
	} catch (error) { setMessage(dashboardMessage, error.message, true); }
});

$('certificate-form').addEventListener('submit', async (event) => {
	event.preventDefault();
	try {
		setMessage(dashboardMessage, 'Saving certificate...');
		const id = $('certificate-id').value;
		const existing = certificates.find((certificate) => certificate.id === id);
		const fileUrl = await uploadFile('certificate-files', $('certificate-file').files[0]);
		const payload = {
			title: $('certificate-title').value.trim(), organization: $('certificate-organization').value.trim(), date: $('certificate-date').value.trim(),
			file_url: fileUrl || existing?.file_url || null, verification_url: $('certificate-verification').value.trim() || null,
			sort_order: Number($('certificate-order').value) || 0, is_published: $('certificate-published').checked
		};
		const query = id ? supabase.from('certificates').update(payload).eq('id', id) : supabase.from('certificates').insert(payload);
		const { error } = await query;
		if (error) throw error;
		resetForm('certificate-form'); await refreshRecords(); setMessage(dashboardMessage, 'Certificate saved.');
	} catch (error) { setMessage(dashboardMessage, error.message, true); }
});

$('projects-list').addEventListener('click', async (event) => {
	const id = event.target.dataset.id;
	if (!id) return;
	if (event.target.classList.contains('edit-project')) fillProjectForm(projects.find((project) => project.id === id));
	if (event.target.classList.contains('delete-project') && window.confirm('Delete this project?')) {
		const { error } = await supabase.from('projects').delete().eq('id', id);
		if (error) setMessage(dashboardMessage, error.message, true); else { await refreshRecords(); setMessage(dashboardMessage, 'Project deleted.'); }
	}
});

$('certificates-list').addEventListener('click', async (event) => {
	const id = event.target.dataset.id;
	if (!id) return;
	if (event.target.classList.contains('edit-certificate')) fillCertificateForm(certificates.find((certificate) => certificate.id === id));
	if (event.target.classList.contains('delete-certificate') && window.confirm('Delete this certificate?')) {
		const { error } = await supabase.from('certificates').delete().eq('id', id);
		if (error) setMessage(dashboardMessage, error.message, true); else { await refreshRecords(); setMessage(dashboardMessage, 'Certificate deleted.'); }
	}
});

$('import-button').addEventListener('click', async () => {
	if (!window.confirm('Import the current local portfolio entries into Supabase? Existing database rows will remain.')) return;
	try {
		setMessage(dashboardMessage, 'Importing current portfolio data...');
		const projectTitles = new Set(projects.map((project) => project.title));
		const certificateTitles = new Set(certificates.map((certificate) => certificate.title));
		const projectsToImport = currentPortfolio.projects.filter((project) => !projectTitles.has(project.title));
		const certificatesToImport = currentPortfolio.certificates.filter((certificate) => !certificateTitles.has(certificate.title));
		const [{ error: projectsError }, { error: certificatesError }] = await Promise.all([
			projectsToImport.length ? supabase.from('projects').insert(projectsToImport) : Promise.resolve({ error: null }),
			certificatesToImport.length ? supabase.from('certificates').insert(certificatesToImport) : Promise.resolve({ error: null })
		]);
		if (projectsError || certificatesError) throw projectsError || certificatesError;
		await refreshRecords(); setMessage(dashboardMessage, projectsToImport.length || certificatesToImport.length ? 'Missing portfolio entries imported.' : 'All portfolio entries are already imported.');
	} catch (error) { setMessage(dashboardMessage, error.message, true); }
});

showDashboard().catch((error) => {
	if (error.message) setMessage(loginMessage, error.message, true);
});
	})();
}

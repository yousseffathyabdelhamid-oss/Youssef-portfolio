window.SUPABASE_CONFIG = {
	url: 'https://fpnfqdxgvagzlebrfssc.supabase.co',
	publishableKey: 'sb_publishable_K6BRlu95PXmednwxaWmxTw_lqqQAYka'
};

window.supabaseClient = window.supabase.createClient(
	window.SUPABASE_CONFIG.url,
	window.SUPABASE_CONFIG.publishableKey
);

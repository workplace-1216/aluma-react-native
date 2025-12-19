// Carrega chaves sem quebrar o app quando estiverem vazias
export const RC_API_KEY_IOS = process.env.RC_API_KEY_IOS ?? 'appl_UZGnVqsQLmhGQSmJlRTFfCSzbwK';
export const RC_API_KEY_ANDROID = process.env.RC_API_KEY_ANDROID ?? 'goog_HxxdrbmAljOEuvnwEsxwnezpoqj';

// habilita billing só quando existir ao menos 1 chave
export const RC_ENABLED = !!(RC_API_KEY_IOS || RC_API_KEY_ANDROID);

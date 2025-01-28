import tyk_eslint from '@taiyuuki/eslint-config'

export default tyk_eslint({
    ts: true,
    vue: true,
    ignores: ['src/waternormal.ts', 'README.md'],
})

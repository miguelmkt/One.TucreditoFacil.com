// Função para minificar CSS em JavaScript
export function minificarCSS(codigoCSS: string): string {
    // Remover espaços em branco desnecessários
    codigoCSS = codigoCSS.replace(/\s+/g, ' ');

    // Remover comentários
    codigoCSS = codigoCSS.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//g, '');

    // Remover espaços antes e depois de : e ;
    codigoCSS = codigoCSS.replace(/\s*([:;])\s*/g, '$1');

    // Remover quebras de linha
    codigoCSS = codigoCSS.replace(/(\r\n|\r|\n)/g, '');

    return codigoCSS;
}

// Função para verificar atualizações (simulação)
export async function verificarAtualizacoes(versaoAtual: string): Promise<void> {
    const url = `https://raw.githubusercontent.com/joinads/plugin-join-ads-loader/main/version.json?ver=${Date.now()}`;

    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'JoinAdsLoader' } });
        if (response.ok) {
            const releaseInfo = await response.json();
            if (releaseInfo.version && releaseInfo.version !== versaoAtual) {
                console.log(`Nova versão disponível: ${releaseInfo.version}`);
                console.log(`Baixe em: ${releaseInfo.url}`);
            } else {
                console.log('Você já está usando a versão mais recente.');
            }
        } else {
            console.error('Erro ao verificar atualizações:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor de atualizações:', error);
    }
}
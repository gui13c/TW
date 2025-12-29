// ==UserScript==
// @name                 Tribal Wars - BuilderPro GODiNjURED (Privado)
// @version              7.7.1
// @author               iNjURED
// @match                https://*.tribalwars.com.pt/*screen=main*
// @match                https://*.tribalwars.com.br/*screen=main*
// @icon                 https://i.pinimg.com/originals/34/6a/c6/346ac610a5ad0a369ec72e410607330b.gif
// @grant                GM_addStyle
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_deleteValue
// @grant                GM_xmlhttpRequest
// @run-at               document-end
// ==/UserScript==

(async function() {
    'use strict';

    // CONFIGURAÇÃO
    const WHITELIST_URL = 'https://raw.githubusercontent.com/GODiNjURED/random/refs/heads/main/whitelist.json';
    const MAIN_SCRIPT_URL = 'https://raw.githack.com/GODiNjURED/TW/main/Builder.js';

    // --- CORREÇÃO AQUI ---
    // Usamos 'unsafeWindow' porque o script está em modo Sandbox
    const gameData = unsafeWindow.game_data;
    const currentPlayer = gameData ? gameData.player.name : null;

    if (!currentPlayer) {
        console.error("BuilderPro: Não foi possível identificar o jogador (game_data não encontrado).");
        return;
    }

    console.log(`BuilderPro: Verificando autorização para '${currentPlayer}'...`);

    try {
        // Adiciona um timestamp (?t=...) para evitar que o PC guarde o ficheiro antigo na memória
        const response = await fetch(WHITELIST_URL + "?t=" + Date.now());

        if (!response.ok) throw new Error("Falha ao contactar servidor de licenças (GitHub).");

        const allowedUsers = await response.json();

        // Verifica se o jogador está na lista
        if (allowedUsers.includes(currentPlayer)) {
            console.log("✅ Acesso AUTORIZADO. A iniciar motor...");

            const scriptResp = await fetch(MAIN_SCRIPT_URL);
            if (!scriptResp.ok) throw new Error("Motor do script não encontrado.");

            const scriptCode = await scriptResp.text();
            eval(scriptCode);

        } else {
            console.warn(`🚫 Acesso NEGADO para: ${currentPlayer}`);
            alert(`⛔ ACESSO BLOQUEADO ⛔\n\nO utilizador '${currentPlayer}' não tem permissão.\nContacta o administrador.`);
        }

    } catch (err) {
        console.error("Erro no Loader:", err);
    }

})();
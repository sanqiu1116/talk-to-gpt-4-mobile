// ==UserScript==
// @name         Let's talk to GPT-4
// @namespace    https://github.com/Unintendedz/talk-to-gpt-4-mobile
// @version      0.1
// @description  Enabling unlimited conversations with the GPT-4-mobile model via a userscript.
// @author       Unintendedz
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==


(function() {
    'use strict';

    const realFetch = window.fetch;
    window.fetch = async function(url, init) {
        const response = await realFetch(url, init);
        if (url.includes('https://chat.openai.com/backend-api/models')) {
            const body = await response.clone().json();

            body.categories.push({
                "category": "gpt_4",
                "human_category_name": "GPT-4 Mobile",
                "subscription_level": "plus",
                "default_model": "gpt-4-mobile"
            });

            const newResponse = new Response(JSON.stringify(body), {
                status: response.status,
                statusText: response.statusText,
                headers: {'Content-Type': 'application/json'}
            });

            return newResponse;
        }
        return response;
    };
})();

// ==UserScript==
// @name         Talk to GPT-4 Mobile
// @name:zh-CN   与 GPT-4 移动版畅聊
// @namespace    https://github.com/Unintendedz/talk-to-gpt-4-mobile
// @version      0.1
// @description  Enabling unlimited conversations with the gpt-4-mobile model via a userscript.
// @description:zh-CN 通过油猴脚本来与 gpt-4-mobile 模型进行对话（没有每3小时25条的限制）。
// @author       Unintendedz
// @match        https://chat.openai.com/*
// @grant        none
// @run-at       document-idle
// @license      WTFPL
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

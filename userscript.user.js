// ==UserScript==
// @name         Talk to GPT-4 Mobile
// @name:zh-CN   与 GPT-4 移动版畅聊
// @namespace    https://github.com/Unintendedz/talk-to-gpt-4-mobile
// @version      0.2
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

    const responseHandlers = {
        'https://chat.openai.com/backend-api/models': async function(response) {
            const body = await response.clone().json();
            body.categories.push({
                "category": "gpt_4",
                "human_category_name": "GPT-4 Mobile",
                "subscription_level": "plus",
                "default_model": "gpt-4-mobile"
            });

            return new Response(JSON.stringify(body), {
                status: response.status,
                statusText: response.statusText,
                headers: {'Content-Type': 'application/json'}
            });
        },

        'https://chat.openai.com/backend-api/moderations': async function(response) {
            const body = await response.clone().json();
            body.flagged = false;
            body.blocked = false;

            return new Response(JSON.stringify(body), {
                status: response.status,
                statusText: response.statusText,
                headers: {'Content-Type': 'application/json'}
            });
        }
    };

    window.fetch = new Proxy(window.fetch, {
        apply: async function(target, thisArg, argumentsList) {
            const response = await Reflect.apply(...arguments);
            for (let key in responseHandlers) {
                if (argumentsList[0].includes(key)) {
                    return responseHandlers[key](response);
                }
            }
            return response;
        }
    });
})();


// Настройка данных
let api_key = "{{{ API_KEY }}}"; //ключ из аналитики
let url_VK = "{{{ URL_VK }}}"; //ссылка на игру в вконтакте
let url_Yandex = "{{{ URL_YANDEX }}}"; //ссылка на игру на яндексе
let isOnlyConsole = "{{{ IS_ONLY_CONSOLE }}}"; //0 - будет отправляться в аналитику, 1 - не будет отправляться в аналитику, а только выводиться в консоль

// создаём заголовки
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Mig-Token", api_key);

let Analytics = {

    uuid: "", //уникальный id игрока для аналитики, сам генерируется и сохраняется
    userid: "", //id игрока на платформе, определяется в init
    point: "", //точка входа в игру (url)
    device: "", //вид девайса - 3 - PC, 4 - Mobile

    on_init: () => {
        history.pushState('', '', new URL(document.URL).pathname)
    },

    get_cookie: (name) => {
        const matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
        return matches ? decodeURIComponent(matches[1]) : undefined
    },

    // инициализация сессии
    init: () => {

        if (!sessionStorageAvailable){
            console.log("sessionStorageAvailable is false!");
            return false;
        }

        let uuid = Analytics.uuid;
        if ( ! uuid) uuid = Analytics.get_cookie('uuid');

        if (!sessionStorage.getItem('session'))
        {
            sessionStorage.setItem('session', uuid);
        }
        
        let platformDetected = detectPlatform();       
        if(platformDetected == "VK")
        {
            loadPlatformSDK("browser.min.js", () => {
                vkBridge.send('VKWebAppInit', {})
                    .then((data) => {
                        console.log ("vkBridge ok");

                        Analytics.point = removeUrlParam(url_VK, window.location.href, "vk_ts", "sign"); //удаляем для безопасности

                        let urlParams = new URLSearchParams(window.location.search);

                        Analytics.userid = urlParams.get("vk_user_id");

                        //определяем вид девайса
                        let vkPlatform = urlParams.get("vk_platform");

                        Analytics.device = "0";
                        if(vkPlatform == "desktop_web" || vkPlatform == "web_external")
                        {
                            Analytics.device = "3"; //PC
                        }
                        else
                        {
                            Analytics.device = "4"; //Mobile
                        }

                        Analytics.initSend();

                    })
                    .catch((error) => {
                        console.log("vkBridge error: " + error);
                    });
            });
            
            
        }   
        else if(platformDetected == "YANDEX")
        {
            loadPlatformSDK("sdk.js", () => {
                console.log("Yandex SDK loaded, initializing...");
                YaGames
                    .init()
                    .then(ysdk => {
                        console.log('Yandex SDK initialized');
                        window.ysdk = ysdk;

                        ysdk.getPlayer({ scopes: false }).then(_player => {
                            console.log("getPlayer ok!");
                            player = _player;

                            Analytics.point = url_Yandex;
                            Analytics.userid = player.getUniqueID();

                            if(ysdk.deviceInfo.type == "desktop")
                            {
                                Analytics.device = "3"; //PC
                            }
                            else
                            {
                                Analytics.device = "4"; //Mobile
                            }

                            Analytics.initSend();
                        }).catch(err => {
                            console.log("getPlayer error: " + err);
                        });
                    });
            });
            
            
        }
    },

    // отправка события инициализации игры после того как получены данные игрока от сдк платформы
    initSend: () => {

        Analytics.send({
            event: "init",
            detail: {
                screen: {
                    dpr: window.devicePixelRatio,
                    w: window.screen.availWidth,
                    h: window.screen.availHeight,
                },
                language: navigator.language,
                maxTouchPoints: 'maxTouchPoints' in navigator ? navigator.maxTouchPoints : 0,
                version: {{{ JSON.stringify(PRODUCT_VERSION) }}},
                inpoint: Analytics.point,
                referrer: document.referrer,
                platform: Analytics.device,
            },
        });
    },
    
//Вход    
    // регистрация нового пользователя
    signup: (sid) => {

        Analytics.send({
            event: "register",
            sid: sid,
        });
    },

    // авторизация
    signin: (sid) => {

        Analytics.send({
            event: "auth",
            sid: sid,
        });
    },

    // Вышел из игры
    logout: (sid) => {

        Analytics.send({
            event: "logout",
            sid: sid,
        });
    },

//Покупки
    //Инициализация платежа
    purchase_init: (sid, price_quantity, price_code, offer_code) => {

        Analytics.send({
            event: "purchase_init",
            sid: sid,
            detail: {
                price_quantity: price_quantity,
                price_code: price_code,
                offer_code: offer_code,
            },
        });
    },

    //Выбор способа оплаты
    purchase_method: (sid, method) => {

        Analytics.send({
            event: "purchase_method",
            sid: sid,
            detail: {
                method: method,
            },
        });
    },

    //Покупка завершена 
    purchase: (sid, price_quantity, price_code, offer_code) => {

        Analytics.send({
            event: "purchase",
            sid: sid,
            detail: {
                price_quantity: price_quantity,
                price_code: price_code,
                offer_code: offer_code,
            },
        });
    },
    
//Реклама
    //Запрос рекламного блока
    rewarded_init: (sid) => {

        Analytics.send({
            event: "rewarded_init",
            sid: sid,
        });
    },

    //Завершение показа рекламного блока 
    rewarded_received: (sid) => {

        Analytics.send({
            event: "rewarded_received",
            sid: sid,
        });
    },

    //Ошибка показа рекламного блока
    rewarded_error: (sid) => {

        Analytics.send({
            event: "rewarded_error",
            sid: sid,
        });
    },
    
//Разное
    // Повышение уровня
    levelup: (sid, level) => {

        Analytics.send({
            event: "levelup",
            sid: sid,
            detail: {
                level: level,
            },
        });
    },

    // смена сцены или окна
    hit: (sid, sceneOrWindow) => {

        Analytics.send({
            event: "hit",
            sid: sid,
            detail: {
                url: sceneOrWindow,
            },
        });
    },

    // скорость загрузки до unity
    speedometerBeforeUnity: (step) => {

        Analytics.send({
            event: "loading",
            detail: {
                step: step,
            },
        });
    },

    // скорость загрузки самой игры после загрузки билда (например инициализация сервисов)
    speedometer: (sid, step) => {

        Analytics.send({
            event: "loading",
            sid: sid,
            detail: {
                step: step,
            },
        });
    },    

    // прохождение туториала
    tutorial: (sid, step) => {

        Analytics.send({
            event: "tutorial",
            sid: sid,            
            detail: {
                step: step,
            },
        });
    },

    // назначение эксперимента
    experiment: (sid, cohort_id) => {

        Analytics.send({
            event: "experiment",
            sid: sid,
            detail: {
                id: cohort_id,
            },
        });
    },

    //Клик
    click: (sid, x, y, window) => {

        Analytics.send({
            event: "click",
            sid: sid,
            detail: {
                x: x,
                y: y,
                scene: window,
            },
        });
    },

    //Фиксация ресурсов игрока в точке
    resource: (sid, dictionary) => {
        
        Analytics.send({
            event: "resource",
            sid: sid,
            detail: dictionary
        });
    },

    // Управление игроком
    user_set: (sid, key, value) => {

        var isCanSend = true;

        if(key != "name" && key != "mail" && !isNaN(str) && !isNaN(parseInt(str)))
        {
            var valueInt = parseInt(str);

            if(key == "password" && (value < 0 || value > 1))
            {
                isCanSend = false;
                console.log("error event user_set: Факт установления пароля должен быть 0 или 1");
            }
            else if(key == "gender" && (value < 0 || value > 2))
            {
                isCanSend = false;
                console.log("error event user_set: Пол должен быть от 0 до 2, где 0 - неустановлен, 1 - Муж, 2 - Жен");
            }
            else if(key == "sound" && value < 0 || value > 100)
            {
                isCanSend = false;
                console.log("error event user_set: громкость звука должна быть от 0 до 100");
            }
            else if(key == "music" && value < 0 || value > 100)
            {
                isCanSend = false;
                console.log("error event user_set: громкость музыки должна быть от 0 до 100");
            }
        }
    else
        {
            if(key == "name" && value.length > 50)
            {
                isCanSend = false;
                console.log("error event user_set: Слишком длинное имя!");
            }
            else if(key == "mail" && value.length > 100)
            {
                isCanSend = false;
                console.log("error event user_set: Слишком длинная почта!");
            }
        }

        if(isCanSend)
        {
            Analytics.send({
                event: "user_set",
                sid: sid,
                detail: {
                    key: key,
                    value: value,
                },
            });
        }
    },
    
    // отправка данных
    send: (dataset) => {

        if(isOnlyConsole == "1")
        {
            console.log(JSON.stringify(dataset));
        }
        else
        {
            dataset.action = "event";
            dataset.uuid = Analytics.uuid;
            dataset.user_id = Analytics.userid;

            fetch("https://maningame.com/analytics/track/", {
                headers,
                method: "POST",
                body: JSON.stringify(dataset),
            }).then(r => '');
        }
    }
}

Analytics.uuid = localStorage.getItem("uuid2");
if (Analytics.uuid == null || (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(Analytics.uuid))) {
    Analytics.uuid = crypto.randomUUID();
    localStorage.setItem("uuid2", Analytics.uuid);
}

// cookie
document.cookie = `uuid=${Analytics.uuid}; max-age=${10 * 365 * 24 * 60 * 60}; path=/`;

// Проверка поддержки sessionStorage
function sessionStorageAvailable() {
    try  { return 'sessionStorage' in window && window['sessionStorage'] !== null; }
    catch (e) { return false; }
}

function removeUrlParam(urlPage, urlParams, paramToRemove_1, paramToRemove_2) {
    var urlObj = new URL(urlParams, urlPage);
    urlObj.searchParams.delete(paramToRemove_1);
    urlObj.searchParams.delete(paramToRemove_2);
    return urlObj.toString();
}

function detectPlatform() {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const hostname = url.hostname;
    const hash = url.hash;
    
    const isVK =
        (searchParams.has("api_id") && searchParams.has("viewer_id") && searchParams.has("auth_key")) ||
        (searchParams.has("vk_user_id") && searchParams.has("sign") && searchParams.has("vk_app_id"));

    const isYandex =
        hostname.includes("yandex.com") ||
        hostname.includes("yandex.net") ||
        hostname.includes("yandex.ru") ||
        hostname.includes("yandexgames") ||
        hostname.includes("game.s3.yandex") ||
        hash.includes("origin=https") && (hash.includes("app-id=") || searchParams.has("app-id"));

    if (isVK) return "VK";
    if (isYandex) return "YANDEX";
    return "UNKNOWN";
}

function loadPlatformSDK(linkSDK, callback) {
    const script = document.createElement("script");
    script.src = linkSDK;
    script.onload = callback;
    script.onerror = () => console.error("Ошибка загрузки SDK " + linkSDK);
    document.head.appendChild(script);
}

Analytics.speedometerBeforeUnity(1);
Analytics.init();

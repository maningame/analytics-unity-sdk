mergeInto(LibraryManager.library, {        
      
    //Вход
        signup: function(sid) {
                Analytics.signup(sid);
            },
        signin: function(sid) {
                        Analytics.signin(sid);
                    },
        logout: function(sid) {
                        Analytics.logout(sid);
                    },
        
    //Покупки
        purchase_init: function(sid, price_quantity, price_code, offer_code) {
                        Analytics.purchase_init(sid, price_quantity, UTF8ToString(price_code), UTF8ToString(offer_code));
                    },     
        purchase_method: function(sid, method) {
                        Analytics.purchase_method(sid, UTF8ToString(method));
                    },  
        purchase: function(sid, price_quantity, price_code, offer_code) {
                        Analytics.purchase(sid, price_quantity, UTF8ToString(price_code), UTF8ToString(offer_code));
                    },  
        
    //Реклама    
        rewarded_init: function(sid) {
                        Analytics.rewarded_init(sid);
                    },                     
        rewarded_received: function(sid) {
                        Analytics.rewarded_received(sid);
                    },   
        rewarded_error: function(sid) {
                        Analytics.rewarded_error(sid);
                    },    
                    
    
    //Разное
        levelup: function(sid, level) {
                        Analytics.levelup(sid, level);
                    },
        hit: function(sid, sceneOrWindow) {
                        Analytics.hit(sid, UTF8ToString(sceneOrWindow));
                    },
        speedometer: function(sid, step) {
                        Analytics.speedometer(sid, step);
                    },
        tutorial: function(sid, step) {
                         Analytics.tutorial(sid, step);
                    },
        experiment: function(sid, cohort_id) {
                         Analytics.experiment(sid, cohort_id);
                    },                    
        click: function(sid, x, y, window) {
                        Analytics.click(sid, x, y, UTF8ToString(window));
                    },
                    
        resource: function (sid, jsonPtr) {
                        var jsonStr = UTF8ToString(jsonPtr);
                        var parsed = JSON.parse(jsonStr);
                    
                        var dictionary = {};
                        for (var i = 0; i < parsed.keys.length; i++) {
                          dictionary[parsed.keys[i]] = parsed.values[i];
                        }
                        
                        Analytics.resource(sid, dictionary);
                    },
                    
        user_set: function(sid, key, value) {
                        Analytics.purchase(sid, UTF8ToString(key), UTF8ToString(value));
                    },                      
});

using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

namespace AnalyticsSDK
{
    public static class Analytics
    {
    #region Sid
        private static bool _isSidLoaded;
        private static int _sid;
        private static int Sid
        {
            get
            {
                if (!_isSidLoaded)
                {
                    _isSidLoaded = true;
                    _sid = PlayerPrefs.GetInt("sid");
                }
                _sid++;
                PlayerPrefs.SetInt("sid", _sid);
                PlayerPrefs.Save();
                return _sid;
            }
        }
    #endregion
        
    #region Methods for JS
        
        //Вход
        [DllImport("__Internal")]
        private static extern void signup(int sid);
        [DllImport("__Internal")]
        private static extern void signin(int sid);
        [DllImport("__Internal")]
        private static extern void logout(int sid);
        
        //Покупки
        [DllImport("__Internal")]
        private static extern void purchase_init(int sid, int price_quantity, string price_code, string offer_code);
        [DllImport("__Internal")]
        private static extern void purchase_method(int sid, string method);
        [DllImport("__Internal")]
        private static extern void purchase(int sid, int price_quantity, string price_code, string offer_code);
        
        //Реклама   
        [DllImport("__Internal")]
        private static extern void rewarded_init(int sid);
        [DllImport("__Internal")]
        private static extern void rewarded_received(int sid);
        [DllImport("__Internal")]
        private static extern void rewarded_error(int sid);
        
        //Разное
        [DllImport("__Internal")]
        private static extern void levelup(int sid, int level);
        [DllImport("__Internal")]
        private static extern void hit(int sid, string sceneOrWindow);
        [DllImport("__Internal")]
        private static extern void speedometer(int sid, int step);
        [DllImport("__Internal")]
        private static extern void tutorial(int sid, int step);
        [DllImport("__Internal")]
        private static extern void experiment(int sid, int cohort_id);
        [DllImport("__Internal")]
        private static extern void click(int sid, int x, int y, string window);
        [DllImport("__Internal")]
        private static extern void resource(int sid, string json);
        [DllImport("__Internal")]
        private static extern void user_set(int sid, string key, string value);
    #endregion
        
    #region Sign
        public static void Signup()
        {
            signup(Sid);
        }
        public static void Signin()
        {
            signin(Sid);
        }
        public static void Logout()
        {
            logout(Sid);
        }
        #endregion
        
    #region IAP
        public static void PurchaseInit(int price_quantity, string price_code, string offer_code)
        {
            purchase_init(Sid, price_quantity, price_code, offer_code);
        }
        public static void PurchaseMethod(string method)
        {
            purchase_method(Sid, method);
        }
        public static void Purchase(int price_quantity, string price_code, string offer_code)
        {
            purchase(Sid, price_quantity, price_code, offer_code);
        }
    #endregion
        
    #region ADs
        public static void RewardedInit()
        {
            rewarded_init(Sid);
        }
        public static void RewardedReceived()
        {
            rewarded_received(Sid);
        }
        public static void RewardedError()
        {
            rewarded_error(Sid);
        }
    #endregion

    #region Other
        //Повышение уровня
        public static void Levelup(int level)
        {
            levelup(Sid, level);
        }
        //Переход на сцену или окно
        public static void Hit(string sceneOrWindow)
        {
            hit(Sid, sceneOrWindow);
        }
        public static void Speedometer(int step)
        {
            speedometer(Sid, step);
        }
        public static void Tutorial(int step)
        {
            tutorial(Sid, step);
        }
        public static void Experiment(int cohort_id)
        {
            experiment(Sid, cohort_id);
        }
        public static void Click(int x, int y, string window)
        {
            click(Sid, x, y, window);
        }
        
        /*
            Пример использования метода Resource:
         
            Resource(new Dictionary<string, int>
            {
                { "coins", 120 },
                { "gems", 45 },
                { "tickets", 7 }
            });
         */
        public static void Resource(Dictionary<string, int> resourceData)
        {
            string json = JsonUtility.ToJson(new DictionaryWrapper(resourceData));
            resource(Sid, json);
        }
        
        /*
         Для метода UserSet все параметры указываются в string, а в отправке в js они автоматом конвертятся в int с проверками на нужный диапазон
         Если будет ошибка, она отобразится в логах и событие отправлено не будет
         
         таблица допустимых параметров
            параметр (key)	тип значения	лимит	описание
            name	string	50 символов	user_name пользователя, или его имя, которое он себе установил в игре
            mail	string	100 символов	e-mail игрока, если он его установил
            password	int	от 0 до 1	факт установки пароля (1 - установлен, 0 - не установлен)
            gender	int	от 0 до 2	половая принадлежность игрока, где 0 - н/о, 1 - Муж, 2 - Жен
            sound	int	от 0 до 100	изменение параметров звуков в игре (где, 0 - звук выключен, 100 - максимальная громкость)
            music	int	от 0 до 100	изменение параметров музыки в игре (где, 0 - музыка выключена, 100 - максимальная громкость музыки)
        */
        
        public static void UserSet(string key, string value)
        {
            user_set(Sid, key, value);
        }
    #endregion

    #region Helper
        [System.Serializable]
        private class DictionaryWrapper
        {
            public List<string> keys = new List<string>();
            public List<int> values = new List<int>();

            public DictionaryWrapper(Dictionary<string, int> dict)
            {
                foreach (var pair in dict)
                {
                    keys.Add(pair.Key);
                    values.Add(pair.Value);
                }
            }
        }
    #endregion
        
    }
}


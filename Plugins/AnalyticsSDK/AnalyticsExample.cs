using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace AnalyticsSDK
{
    public class AnalyticsExample : MonoBehaviour
    {
        
    #region Sign
        public void Signup()
        {
            Analytics.Signup();
        }
        public void Signin()
        {
            Analytics.Signin();
        }
        public void Logout()
        {
            Analytics.Logout();
        }
        #endregion
        
    #region IAP
        public void PurchaseInit()
        {
            Analytics.PurchaseInit(100, "YAN", "ProductName");
        }
        public void PurchaseMethod()
        {
            Analytics.PurchaseMethod("Xsolla");
        }
        public void Purchase()
        {
            Analytics.PurchaseInit(100, "YAN", "ProductName");
        }
    #endregion
        
    #region ADs
        public void RewardedInit()
        {
            Analytics.RewardedInit();
        }
        public void RewardedReceived()
        {
            Analytics.RewardedReceived();
        }
        public void RewardedError()
        {
            Analytics.RewardedError();
        }
    #endregion

    #region Other
        //Повышение уровня
        public void Levelup()
        {
            Analytics.Levelup(1);
        }
        //Переход на сцену или окно
        public void Hit()
        {
            Analytics.Hit("Game");
        }
        public void Speedometer()
        {
            Analytics.Speedometer(2);
        }
        public void Tutorial()
        {
            Analytics.Tutorial(1);
        }
        public void Experiment()
        {
            Analytics.Experiment(1);
        }
        public void Click()
        {
            Analytics.Click(100, 200, "Window_Offer");
        }
        
        public void Resource()
        {
            Analytics.Resource(new Dictionary<string, int>
            {
                { "coins", 120 },
                { "gems", 45 },
                { "tickets", 7 }
            });
        }
        
        public void UserSet()
        {
            Analytics.UserSet("name", "Пухлощёкий");
        }
    #endregion
    }
}
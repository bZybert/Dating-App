using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            // new header with message
            response.Headers.Add("Application-Error", message);

            // methods below allows to display "Application-Error
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");

        }

        // calculate age depending on user Birth date and today date
        public static int CalculateAge(this DateTime theDateTime)
        {
            // setting value of age (theDateTime will be user BirthDate)
            var age = DateTime.Today.Year - theDateTime.Year;

            // checking if user add his birthDate
            if (theDateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}
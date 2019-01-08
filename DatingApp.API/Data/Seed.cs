using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _context;
        public Seed(DataContext context)
        {
            _context = context;
        }

        public void SeedUsers()
        {
            // getting our custom users from UserSeedData.json file
            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");

            // converting text to an object
            // after converting it will contain list of user object
            var users = JsonConvert.DeserializeObject<List<User>>(userData);

            foreach (var user in users)
            {
                // creating password hash and salt
                byte[] passwordHash, passwordSalt;

                // adding 'out' make that when we change value inside this method
                //  it will change value of variable passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);

                // adding missing field to user
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                // changing characters to lower case
                user.Name = user.Name.ToLower();

                // adding complete user to data
                _context.Users.Add(user);
            }
            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {

                passwordSalt = hmac.Key;

                //.ComputeHash(byte[] buffer) --> changing string password to 'byte[] buffer' -> System.Text.Encoding.UTF8.GetBytes(password)
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }
    }
}
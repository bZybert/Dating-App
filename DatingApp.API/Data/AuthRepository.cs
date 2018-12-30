using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<User> Login(string username, string password)
        {
            // find user in db, if there isn't any return null
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Name == username);
            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        // method for verify password from user input and compare it
        // with password id db belongs to this user
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {

            // 
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {

                //.ComputeHash(byte[] buffer) --> changing string password to 'byte[] buffer' -> System.Text.Encoding.UTF8.GetBytes(password)
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                //computedHash return byte[] so we need to iterate the result
                for (int i = 1; i < computedHash.Length; i++)
                {
                    //checking every mark and campare it with the same in db
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }

            }
            return true;
        }

        /// Register new user in database and protect password with cryptography
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            // 'out' before passwordHash makes it we passing a referance to this variables
            // and when we change it inside this methed automaticly update value of variable
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;

        }

        // method for cryptography the password
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {

                passwordSalt = hmac.Key;

                //.ComputeHash(byte[] buffer) --> changing string password to 'byte[] buffer' -> System.Text.Encoding.UTF8.GetBytes(password)
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }

        // checking if username exist already in Users db
        public async Task<bool> UserExist(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Name == username))
                return true;

            return false;

        }
    }
}
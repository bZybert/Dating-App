using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    //      api/auth
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        #region Constructor 
        // registered interface with every created methods
        private IAuthRepository _repo { get; }

        // field needed for config token
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }
        #endregion

        #region Register
        //this isnt the only HTTPPost so we need to specify what controller will be used here ("register")
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Name = userForRegisterDto.Name.ToLower();

            if (await _repo.UserExist(userForRegisterDto.Name))
                return BadRequest("Username already exist");

            var userToCreate = new User
            {
                Name = userForRegisterDto.Name
            };

            var createdUser = _repo.Register(userToCreate, userForRegisterDto.Password);

            //return CreatedAtRoute();

            return StatusCode(201);
        }
        #endregion

        #region Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            // searching user in our db
            var userFromRepo = await _repo.Login(userForLoginDto.Name.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            // if user exist create special token for this account
            #region Token
            //creating token for user
            var claims = new[]{
                // for user id
                    new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),

                // for user name
                    new Claim(ClaimTypes.Name, userFromRepo.Name)
                };

            //creating a special key
            // need to create section AppSettings:Token in  appsettings.json
            // Token should be very long string with random characters
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            // now we need to generate our signing credentials for our key
            // SecurityAlgorithms.HmacSha512Signature algorithm to hash our key
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // create security key descriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            // create token handler 
            var tokenHandler = new JwtSecurityTokenHandler();

            // final jwt token for user
            var token = tokenHandler.CreateToken(tokenDescriptor);
            #endregion

            // send token for client account
            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
        #endregion
    }
}
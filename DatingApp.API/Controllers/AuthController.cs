using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    //      api/auth
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // registered interface with every created methods
        public IAuthRepository _repo { get; }
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        //this isnt the only HTTPPost so we need to specify what controller will be used here ("register")
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // validate request 

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

    }
}
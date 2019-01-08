using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;

        // automapper field
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;

        }

        // api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            // geting all users from db
            var users = await _repo.GetUsers();

            // mapping our UserForListDto to User
            // to work it must be specify in mapper profiles (AutoMapperProfiles)
            var userToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(userToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            // mapping our user class to UserForDetailedDto
            // to work it must be specify in mapper profiles (AutoMapperProfiles)
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            return Ok(userToReturn);
        }
    }
}
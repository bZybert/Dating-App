using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdate)
        {
            /**
            checking if user does attempt to update profile matches the token 
            that the server receiving 
             */
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var userFromRepo = await _repo.GetUser(id);

            //  mapping userForUpdate to userFromRepo
            _mapper.Map(userForUpdate, userFromRepo);

            // checking if data was mapped successfully and save
            if (await _repo.SaveAll())
                return NoContent();

            // if somethings go wrong throw exception
            throw new Exception($"Updating user {id} failed on save");
        }
    }
}
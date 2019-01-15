using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    /**
    controller for handling adding photos from user,
    photos will be saved in cloud (cloudinary)
     */
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfigs;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfigs)
        {
            _cloudinaryConfigs = cloudinaryConfigs;
            _mapper = mapper;
            _repo = repo;

            // creating new cloudinary account
            Account acc = new Account(
                _cloudinaryConfigs.Value.CloudName,
                _cloudinaryConfigs.Value.ApiKey,
                _cloudinaryConfigs.Value.ApiSecret
            );

            // send new created account to our field
            _cloudinary = new Cloudinary(acc);
        }

        // Name is needed for property in AddPhotoFromUser method (return CreatedAtRoute())
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            // this will return also data of user like details ...
            var photoFromRepo = await _repo.GetPhoto(id);

            // we return just photo
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoFromUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            /**
                        checking if user does attempt to update profile matches the token 
                        that the server receiving 
                         */
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var userFromRepo = await _repo.GetUser(userId);

            // variable to store photo file
            var file = photoForCreationDto.File;

            // variable to store result we've gonna get from cloudinary
            // new ImageUploadResult(); cloudinary class
            // we've got PublicId field
            var uploadResult = new ImageUploadResult();

            // checking if there is something inside file
            if (file.Length > 0)
            {
                // read this file into memory
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                        // transformation  ->  cutting image to size in our web
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            // mapping our result to photo class
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            //if this is first photo, set it as main
            if (!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;

            userFromRepo.Photos.Add(photo);



            if (await _repo.SaveAll())
            {
                // we add this after save to get id
                // information what we send to client
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }


            return BadRequest("Could not add the photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            /**
                        checking if user does attempt to update profile matches the token 
                        that the server receiving 
                         */
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await _repo.GetUser(userId);

            // checking if photo 'id' what we passing in is not matching with any of user photo collection
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");

            // find previews mainPhoto and change it to false
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);

            // change current photo to false
            currentMainPhoto.IsMain = false;

            // set new chosen photo as main
            photoFromRepo.IsMain = true;

            // save changes
            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("Could not set photo as main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            /**
                        checking if user does attempt to update profile matches the token 
                        that the server receiving 
                         */
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await _repo.GetUser(userId);

            // checking if photo 'id' what we passing in is not matching with any of user photo collection
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photoFromRepo = await _repo.GetPhoto(id);

            // checking if this photo is already set as main
            if (photoFromRepo.IsMain)
                return BadRequest("you cannot delete main photo");

            // photo added randomly from user doesn't have publicId
            if (photoFromRepo.PublicId != null)
            {
                // creating DeletionParams and send to it our photo.publicId
                var deletionParams = new DeletionParams(photoFromRepo.PublicId);
                // claudinary method for delete photo
                // photo to delete require publicId property
                // Destroy() require create DeletionParams parameters
                var result = _cloudinary.Destroy(deletionParams);
                // if delate ended successfully we should get { "result" : "ok"}
                if (result.Result == "ok")
                {
                    // we delete reference to this photo from our db
                    _repo.Delete(photoFromRepo);
                }
            }

            // if photo doesn't have publicId - user add it randomly
            if (photoFromRepo.PublicId == null)
            {
                // we delete reference to this photo from our db
                _repo.Delete(photoFromRepo);
            }

            // save change
            if (await _repo.SaveAll())
                return Ok();

            //if save end with fail
            return BadRequest("Failed to delete photo");
        }
    }
}
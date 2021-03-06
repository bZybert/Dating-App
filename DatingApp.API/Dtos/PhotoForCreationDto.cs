using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dtos
{
    public class PhotoForCreationDto
    {
        public string url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }

        // this field we gonna get from cloudinary
        public string PublicId { get; set; }

        public PhotoForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}
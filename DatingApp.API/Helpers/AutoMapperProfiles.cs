using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    // created for specify our class what we want map
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // <source and destination mapping>
            // if names in those two classes are same, there is no need for configuration
            CreateMap<Photo, PhotosForDetailedDto>();

            // else we have to config different field
            // destination (dest.PhotoUrl) User don't have field PhotoUrl
            // we assign to it first photo from Photos collection of this user
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt =>
            {
                // Resolve destination member using a custom value resolver callback
                // CalculateAge() our callback - custom function created in helpers/extensions
                opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
            });


            CreateMap<User, UserForDetailedDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt =>
            {
                // Resolve destination member using a custom value resolver callback
                // CalculateAge() our callback - custom function created in helpers/extensions
                opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
            });




        }
    }
}
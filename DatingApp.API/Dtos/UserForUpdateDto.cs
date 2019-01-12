namespace DatingApp.API.Dtos
{
    // shape of data from user edit profile module
    // we need to map this to User class
    public class UserForUpdateDto
    {
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}
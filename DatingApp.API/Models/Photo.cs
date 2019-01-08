using System;

namespace DatingApp.API.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }

        // when we add this two field,  new created table  will have option cascade delete
        // onDelete: ReferentialAction.Cascade
        // when we delete user, photos also will be deleted
        public User User { get; set; }
        public int UserId { get; set; }

    }
}
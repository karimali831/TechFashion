namespace api.Dto
{
    public class CreateUsertDto
    {
        public required string Email { get; set; }
        public Guid? GuestCheckoutId { get; set; }
        public required string FirebaseUid { get; set; }
        public required string Name { get; set; }
    }
}
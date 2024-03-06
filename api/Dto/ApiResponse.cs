namespace api.Dto
{
  public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public string? ErrorMsg { get; set; }
    }
}
namespace api.Enum
{
    public enum ReturnStatus
    {
        Requested,
        Pending,
        Returned,
        Complete, // items in the return were inspected and can refund the return
        Rejected
    }
}
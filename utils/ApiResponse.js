class ApiResponse
{
    constructor(statucCode, data, message)
    {
        this.statucCode=statucCode
        this.data=data
        this.message=message
        this.success= statusCode<400
    }
}
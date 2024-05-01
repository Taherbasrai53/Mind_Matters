class ApiError extends Error
{
    constructor(statusCode, message="something went wrong", errors=[], statck=""){
        console.log("hello")
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.errors=errors
        //this.stack=statck
        this.success=false
        this.data=null
        console.log("hello2")
        // if(statck)
        // {
        //     this.stack=statck
        // }
        // else
        // {
        //     Error.captureStackTrace(this, this.constructor)
        // }
    }
}

export {ApiError}
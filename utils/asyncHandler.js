// const asyncHandler= (func)=> async (req, res, next) =>
// {
//     try
//     {
//         await func(req, res, next)
//     }
//     catch(err)
//     {
//         res.status(err.code || 500).json({
//             success:false,
//             msg:"err.message"
//         })
//     }
// }

const asyncHandler= (requestHandler)=> {
    
    return async (req, res, next)=> {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>{
            next(err)
        })
    }
}

export {asyncHandler}
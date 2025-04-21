//we'll use this function in situations when we don't have an error in the system but we want to add the error .ex:- in signup route   return res.status(400).json({message: 'All fields are required'});

export const errorHandler=(statusCode,message)=>{
  const error=new Error();
  error.statusCode=statusCode;
  error.message=message;
  return error;
}
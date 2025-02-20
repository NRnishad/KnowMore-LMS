import { NextFunction, Request, Response } from "express";
import { registerUser } from "../../application/use-cases/user/registerUser";
import { generateOtp } from "../../infrastructure/services/otpService";
import { loginUser } from "../../application/use-cases/user/loginUser";
import { verifyOtpCode } from "../../application/use-cases/user/verifyOtp";
import { sendOtp } from "../../application/use-cases/user/sendOtp";
import { refreshAccessToken } from "../../application/use-cases/user/refreshAccessToken";
import { logout } from "../../application/use-cases/user/logout";
import { verifyAccessTokenUseCase } from "../../application/use-cases/user/verifyToken";
import { resetPassword, sendResetOtp, verifyResendOtp } from "../../application/use-cases/user/resetPassword";
import { CustomError } from "../middlewares/errorMiddleWare";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtHelper";
import { accessTokenOptions, refreshTokenOptions } from "../../infrastructure/config/jwt";
import { loginAdmin } from "../../application/use-cases/admin/adminLogin";


export const signUp = async (req: Request, res: Response , next: NextFunction) => {
    try{ 
    const user:any = await registerUser(req.body);
        const {password, ...rest} = user._doc
        //send otp 
        const sentOTP = await sendOtp(user.email)
        console.log(sentOTP)
       res.status(201).json({success: true, user: rest});
    }catch(error : any){
        // res.status(500).json({error: error.message})
        next(error)
    }
};   

export const sendOtpHandler = async (req: Request, res: Response) => {
    try{
        const {email} = req.body;
        //sent otp 
        const sentOTP = await sendOtp(email)
        console.log('sentOtp controller', sentOTP)
        res.status(200).json(sentOTP)
    }catch(error : any){
        res.status(400).json({error : error.message})
        console.log(error.message)
    }
}

export const verifyOtpHandler = async (req: Request, res: Response) => {
    try{
        const {email, otp} = req.body;
        console.log(email,otp)
        const response = await verifyOtpCode(email, otp)
        res.status(200).json(response)
    }catch(error : any){
        res.status(400).json({success : false , message: error.message})
        console.log(error)
    }
}


export const loginHandler = async (req: Request, res : Response, next: NextFunction) => {
    try{
        const {email, password, role} = req.body;
        const response = await loginUser(email, password, role);
        console.log(response)
            res.cookie('refreshToken', response.refreshToken, refreshTokenOptions )
            res.cookie('accessToken', response.accessToken, accessTokenOptions)
        
        res.status(200).json({success: true, user : response.user, token: response.accessToken})
    }catch(error : any){
        next(error)
    }
}

export const adminLoginHandler = async (req: Request, res : Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;
        const response = await loginAdmin(email, password);
       // console.log(response)
            res.cookie('adminRefreshToken', response.refreshToken, refreshTokenOptions )
            res.cookie('adminAccessToken', response.accessToken, accessTokenOptions)

        res.status(200).json({success: true, user : response.user, token: response.accessToken})
    }catch(error : any){
        next(error)
    }
}

//refresh access token after expire
export const refreshTokenHandler = async(req: Request, res: Response, next : NextFunction) => {
    try {

        const token = req.cookies.refreshToken;
        console.log(token)
        const accessToken =await refreshAccessToken(token)

        res.cookie('accessToken', accessToken, accessTokenOptions)
        res.status(200).json({success: true, data:accessToken})
        
    } catch (error) {
        next (error)
    }
}
//refresh admin access token after expire
export const refreshAdminTokenHandler = async(req: Request, res: Response, next : NextFunction) => {
    try {
        const token = req.cookies.adminRefreshToken;
        console.log('adminrefreshtoken',token)
        const adminAccessToken = await refreshAccessToken(token)
        
        //console.log('admin token from controller', adminAccessToken)

        res.cookie('adminAccessToken', adminAccessToken, accessTokenOptions)
        res.status(200).json({success: true, data:adminAccessToken})
        
    } catch (error) {
        res.clearCookie('adminAccessToken', { httpOnly: true,  sameSite: 'strict' })
        res.clearCookie('AdminRefreshToken', { httpOnly: true, sameSite: 'strict' })
        next (error)
    }
}


//logout handler 

export const logoutHandler = async(req : Request, res: Response, next: NextFunction) => {
    try{
        //clear cookies for access and refreshtoken
        res.clearCookie('accessToken', { httpOnly: true,  sameSite: 'strict' })
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' })

        const message = logout();

        res.status(200).json({success : true , message})
    }catch(error){
        next(error)
    }
}
//logout handler 

export const adminLogoutHandler = async(req : Request, res: Response, next: NextFunction) => {
    try{
        //clear cookies for access and refreshtoken
        res.clearCookie('adminAccessToken', { httpOnly: true,  sameSite: 'strict' })
        res.clearCookie('adminRefreshToken', { httpOnly: true, sameSite: 'strict' })

        const message = logout();
        res.status(200).json({success : true , message})
    }catch(error){
        next(error)
    }
}


export const validateUser = async(req: Request, res: Response):Promise<any> =>{
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message : 'Access token expired'})
    }
    try{
        const verifyUser =  verifyAccessTokenUseCase(accessToken);
        console.log(verifyUser)
        return res.status(200).json({verifyUser})
    }catch(error){
        return res.status(401).json({message: "Unauthorized"})
    }
}

//reset password 

export const resetPasswordOtpSendHandler = async(req: Request, res: Response, next: NextFunction) => {
    try {
         const {email} = req.body;
         if(!email) throw new CustomError('Email required', 404 )

         const sendOtp = await sendResetOtp(email)
         console.log(email, sendOtp)

         res.status(200).json(sendOtp.message)
         
    } catch (error) {
        next(error)
    }
}

export const resetPasswordOtpVerifyHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const {email, otp } = req.body;
            if(!email && !otp ){
                throw new CustomError('email and otp required', 400)
            } else if(!email){
                throw new CustomError('email required', 400)
            }else if(!otp) {
                throw new CustomError('otp required', 400)
            }
            
        const verifyOtpResponse = await verifyResendOtp(email, otp)
        console.log(email,otp)
        res.status(200).json(verifyOtpResponse)
        
    } catch (error) {
        next(error)
    }
}

export const resetPasswordHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const {email,otp , password} = req.body;

        if(!email || !otp || !password ){
            let error:string[] = []
            if(!email) error.push('email')
            if(!otp) error.push('otp')
            if(!password) error.push('password')

                throw new CustomError(`${error.join(',')} required`, 400)
        }

        const verifyOtp = await verifyResendOtp(email, otp)
        const resettedUser = await resetPassword(email, password)
       console.log( email, 'password reset success')
        res.status(200).json({message: 'Password reset successful'})
    } catch (error) {
        next(error)
    }

}


interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

export const googleLoginSuccess = (req: AuthenticatedRequest, res: Response)  => {
  const user = req.user;
  console.log(user)

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const accessToken = generateAccessToken({id:user.id, role:user.role}); // Function to generate JWT
 const refreshToken = generateRefreshToken({id:user.id})

  res.cookie('accessToken', accessToken, accessTokenOptions)
  res.cookie('refreshToken', refreshToken, refreshTokenOptions )
    // Set the JWT token in a cookie

  res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || 'student',  // Adjust role as necessary
    },
    token: accessToken
  });
};

export const googleLoginFailure = (req: Request, res: Response) => {
  res.status(401).json({ message: 'Google login failed' });
};

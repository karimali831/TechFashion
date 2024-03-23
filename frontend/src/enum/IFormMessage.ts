export interface IFormMessage {
    message: string;
    code?: IFormMessageCode;
    isSuccess?: boolean;
}

export enum IFormMessageCode {
    UserNotFound = "auth/user-not-found",
    InvalidEmail = "auth/invalid-email",
    WrongPassword = "auth/wrong-password",
    EmailAlreadyInUse = "auth/email-already-in-use",

    PasswowrdsMismatched = "passwordsmismatched",
    // ServerError = "servererror",
    // InvalidName = "invalidname",
    // InvalidUserName = "invalidusername",
    // PasswordEmpty = "passwordempty",
    // RepeatPasswordEmpty = "repeatpasswordempty",
    // SendForgotEmailSuccess = "sendforgotemailsuccess",
    // // Host
    // InvalidChannelName = "invalidchannelname"
}

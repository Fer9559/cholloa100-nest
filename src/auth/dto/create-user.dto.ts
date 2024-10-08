import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\N])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'La contraseña debe contener de contener mayúsculas, minúsculas, números y al menos 6 caracteres.'
        })
    password: string;

    @IsString()
    @MinLength(3)
    fullName: string;

}
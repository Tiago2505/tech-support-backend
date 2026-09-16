import { IsNotEmpty, IsString } from "class-validator";



export class ImageDto{

    @IsString()
    @IsNotEmpty()
    publicId!: string;
    
    @IsString()
    @IsNotEmpty()
    secureUrl!: string;

    

}
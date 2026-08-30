import { UpdateTicketDto } from "../dto";


export interface UpdateTicketParams{

    id: number;
    updateTicketDto: UpdateTicketDto;
    updatedBy: number;
    newImages: Express.Multer.File[];


}
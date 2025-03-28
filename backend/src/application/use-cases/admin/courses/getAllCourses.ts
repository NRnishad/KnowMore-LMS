import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

interface CourseParams {
    categories?: string;
    sortBy?: string;
    rating?: number | null;
    level?: string | null;
    page?: number;
    limit?: number;
    query?: string;
  }
  
  interface Pagination {
    page: number;
    limit: number;
  }

export class GetAllCoursesAdminUseCase{
    constructor(private courseRepository: ICourseRepository) {}
    async execute(params:CourseParams) {
        const{
            categories,
            sortBy,
            rating,
            level,
            page,
            limit,
            query
        } = params;

        const filter : Record<string, any> = {
            ...(categories && {category: {$in: categories.split(",")}}),
            ...(rating !== undefined && {rating : {$gte: rating}}),
            ...(level && {level}),
            ...(query && {title: { $regex : query, $options : 'i'}})
        }

        const sort : Record<string, number> = {};
        if(sortBy === 'priceLowToHigh') sort.price = 1;
        else if(sortBy === 'priceHighToLow') sort.price = -1;
        else if(sortBy === 'ratingLowToHigh') sort.rating = 1;
        else if(sortBy === 'ratingHghToLow') sort.rating = -1;
        else if(sortBy === 'a-z') sort.title = 1;
        else if(sortBy === 'z-a') sort.title = -1;
        else if(sortBy === '' || sortBy === undefined) sort.createdAt = -1;
        console.log(sort)

        const pagination:  Pagination | null = page && limit ? {page , limit} : null;

         return this.courseRepository.getAllCoursesAdmin(filter, sort, pagination)
        
    }
}
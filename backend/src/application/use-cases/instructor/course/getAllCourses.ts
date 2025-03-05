import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class GetAllCoursesUseCase{
    constructor(private courseRepository: ICourseRepository) {}
    async execute(userId : string): Promise <ICourses[]> {
        const courses = await this.courseRepository.getAllCourses(userId);
        if(!courses) {
            throw new CustomError('Error fetching courses from DB', 400)
        }
        return courses;
    }
}
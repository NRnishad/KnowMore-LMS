import Courses, { ICourses } from "../../domain/models/Courses";
import { ICourseRepository } from "../../application/repositories/ICourseRepository";
import { SortOrder } from "mongoose";

interface Pagination {
  page: number,
  limit: number
}

interface Filter {
  [key : string] : any
}

interface PaginatedResultCourses {
  courses: ICourses[];
  totalCourses: number;
  totalPages : number | null;
}

export class CourseRepositoryClass implements ICourseRepository{
    async createCourse(data: Partial<ICourses>): Promise<ICourses>{
        const category = new Courses(data);
        return await category.save()
    }

   async getCourseById(id: string) : Promise<ICourses | null>{
        return await Courses.findOne({_id:id, isDeleted: false}).populate([
            { path: 'category'},
            {path : 'instructor', select:'-password -phone -profileImagePublicId'}
        ]
        )
   }

   async getAllCourses(userId: string) : Promise<ICourses[] | null>{
        return await Courses.find({instructor: userId ,isDeleted: false}).populate([
            { path: 'instructor', select: '-password -phone -profileImagePublicId' },
            {path: 'category', select: 'name _id'}
        ])
        .sort({createdAt: -1})
   }


   async getCourseByName(title: string) : Promise<ICourses | null> {
    return await Courses.findOne({title, isDeleted: false})
}

// Add lectures to the course
async addLectures(courseId: string, lectures: any[]): Promise<ICourses | null> {
    return await Courses.findOneAndUpdate(
      {_id: courseId, isDeleted: false},
      { $push: { lectures: lectures  } },
      { new: true }
    );
  }

  async deleteCourse(courseId: string): Promise<ICourses | null> {
      return await Courses.findByIdAndUpdate(courseId, {isDeleted: true}, {new: true})
  }
    
  async updateCourse(courseId: string, updateData: Partial<ICourses>): Promise<ICourses | null> {
    return await Courses.findOneAndUpdate({_id: courseId, isDeleted: false}, updateData, {new : true})
  }
    

  // Update lectures to the course
async updateLecture(courseId: string, udpatedLectureData: any[]): Promise<ICourses | null> {
  console.log('updtaelecute')
  const course = await Courses.findOne({_id: courseId, isDeleted: false});
  if(!course){
    throw new Error('Course not found')
  }
  console.log('updated lecture data', udpatedLectureData)

  const updatedLectures =  [];
  for(let newData of udpatedLectureData){
    updatedLectures.push(newData)
  }


  const updatedLecture =  await Courses.findOneAndUpdate(
    {_id: courseId, isDeleted: false},
    { $set: { lectures : updatedLectures  } },
    { new: true }
  );
  console.log(updatedLecture)
  if(!updatedLecture) throw new Error('Lecture update failed')
  return updatedLecture;
}

async publishCourse(courseId: string, publishValue : boolean): Promise<ICourses | null> {
  return await Courses.findOneAndUpdate({_id : courseId, isDeleted: false}, 
    {$set: {isPublished: publishValue}}, 
    { new: true})
}

async getAllCoursesUsers(): Promise<ICourses[] | null> {
  return await Courses.find({isDeleted: false, isPublished: true}).populate([
    {path: 'instructor', select: '-password -profileImagePublicId'},
    {path: 'category', select: 'name _id'}
  ]).sort({createdAt: -1})
}

//filtered course for users (search, filter, sort)

async getAllFilteredCoursesUsers(filter : Filter, sort:Record<string, SortOrder>, pagination : Pagination): Promise<PaginatedResultCourses> {
  const query = Courses.find({...filter, isPublished: true, isDeleted : false}).populate([
    {path: 'instructor', select: '-password -profileImagePublicId'},
    {path: 'category', select: 'name _id'}
  ])

  if(sort){
    query.sort(sort).collation({ locale: 'en', strength: 2 })
  }

  if(pagination){
    const skip = (pagination.page - 1) * pagination.limit;
    query.skip(skip).limit(pagination.limit)
  }

  const courses = await query.exec();

  const totalCourses = await Courses.countDocuments({...filter, isPublished: true});
  const totalPages = pagination ? Math.ceil(totalCourses / pagination.limit) : null;

  return {
    courses, 
    totalCourses,
    totalPages
  }
}

async getAllCoursesAdmin(filter:Filter, sort: Record<string, SortOrder>, pagination: Pagination):Promise<PaginatedResultCourses> {

  const query = Courses.find({...filter, isPublished: true, isDeleted:false}).populate([
    {path: 'instructor', select: '-password -profileImagePublicId'},
    {path: 'category', select: 'name _id'}
  ])

  if(sort){
    query.sort(sort).collation({ locale: 'en', strength: 2 })
  }

  if(pagination){
    const skip = (pagination.page - 1) * pagination.limit;
    query.skip(skip).limit(pagination.limit)
  }

  const courses = await query.exec();

  const totalCourses = await Courses.countDocuments({...filter, isPublished: true});
  const totalPages = pagination ? Math.ceil(totalCourses / pagination.limit) : null;

  return {
    courses, 
    totalCourses,
    totalPages
  }
}
}
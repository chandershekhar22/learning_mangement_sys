import { createContext } from "react";
import { useState } from "react";

export const StudentContext=createContext(null)

export default function StudentProvider({children}){

const [studentViewCoursesList,setStudentViewCoursesList]=useState([])
const [loadingState,setLoadingState]=useState(true)
const [studentViewCourseDetails,setStudentviewCourseDetails]=useState([]);
const [currentcourseDetailsId,setCurrentCoursedetailsId]=useState(null)
const [studentBoughtCoursesList,setStudentBoughtCoursesList]=useState([])
const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});
    return <StudentContext.Provider
     value={{studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentviewCourseDetails,
        currentcourseDetailsId,
        setCurrentCoursedetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
    }}
    >
        {children}
        </StudentContext.Provider>
}
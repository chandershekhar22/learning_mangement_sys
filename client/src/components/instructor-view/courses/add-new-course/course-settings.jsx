import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "@/components/ui/input";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";
import { mediaUploadService } from "@/services";
import MediaProgressbar from "@/components/media-progress-bar";
function CourseSettings() {
    const { courseLandingFormData, setCourseLandingFormData ,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
    } =
        useContext(InstructorContext);
        async function handleImageUploadChange(event){
            const selectedImage=event.target.files[0];

            if(selectedImage){
                const imageFormData=new FormData();
                imageFormData.append('file',selectedImage)

                try {
                    setMediaUploadProgress(true)
                    const response=await mediaUploadService(imageFormData,setMediaUploadProgressPercentage)
                  
                    if(response.success){
                        setCourseLandingFormData({
                            ...courseLandingFormData,
                            image:response.data.url
                        })
                        setMediaUploadProgress(false)
                    }
                    
                } catch (error) {
                    console.log(error);
                    
                }
            }
        }
    return (
    <Card>
        <CardHeader>
            <CardTitle>
                course settings
            </CardTitle>
        </CardHeader>
        <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
        <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
    )
}
export default CourseSettings
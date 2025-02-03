import { useEffect, useContext, useState } from "react";
import { useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import {
    fetchStudentViewCourseDetailsService,
    createPaymentService,
    checkCoursePurchaseInfoService,
} from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import VideoPlayer from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { StudentContext } from "@/context/student-context";
import { AuthContext } from "@/context/auth-context";

function StudentViewCourseDetailsPage() {
    const { id } = useParams();
    const location = useLocation();
    const {
        studentViewCourseDetails,
        setStudentviewCourseDetails,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);
    const { auth } = useContext(AuthContext);

    const [approvalUrl, setApprovalUrl] = useState("");
    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
        useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const navigate=useNavigate();

    useEffect(() => {
        if (id) fetchCourseDetails(id);
        return () => setStudentviewCourseDetails(null);
    }, [id]);

    useEffect(() => {
        if (!location.pathname.includes("course/details")) {
            setStudentviewCourseDetails(null);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) {
            setShowFreePreviewDialog(true);
        }
    }, [displayCurrentVideoFreePreview]);

    const freePreviewItem =
        studentViewCourseDetails?.curriculum?.find((item) => item.freePreview) ||
        null;

    async function fetchCourseDetails(courseId) {
        setLoadingState(true);
        try {
          const checkCoursePurchaseInfoResponse=await checkCoursePurchaseInfoService(courseId,auth?.user._id)

          if(checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse?.data){
            navigate(`/course-progress/${courseId}`)
            return;
          }
          
            const response = await fetchStudentViewCourseDetailsService(courseId);
            if (response?.success) {
                setStudentviewCourseDetails(response.data);
            } else {
                setStudentviewCourseDetails(null);
            }
        } catch (error) {
            console.error("Failed to fetch course details:", error.message);
        } finally {
            setLoadingState(false);
        }
    }

    async function handleCreatePayment() {
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "initiated",
            orderDate: new Date(),
            paymentId: "",
            payerId: "",
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: studentViewCourseDetails?.pricing,
        };

        try {
            const response = await createPaymentService(paymentPayload);
            if (response.success) {
                sessionStorage.setItem(
                    "currentOrderId",
                    JSON.stringify(response?.data?.orderId)
                );
                setApprovalUrl(response?.data?.approveUrl);
            } else {
                console.error("Payment failed:", response.message);
            }
        } catch (error) {
            console.error("Payment error:", error.message);
        }
    }

    function handleSetFreePreview(curriculumItem) {
        if (curriculumItem?.freePreview) {
            setDisplayCurrentVideoFreePreview(curriculumItem.videoUrl);
            setShowFreePreviewDialog(true);
        }
    }

    if (loadingState) {
        return <SkeletonLoading />;
    }

    if (approvalUrl) {
        window.location.href = approvalUrl;
    }

    return (
        <div className="mx-auto p-4">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">
                    {studentViewCourseDetails?.title || "Course Title"}
                </h1>
                <p className="text-xl mb-4">
                    {studentViewCourseDetails?.subtitle || "Subtitle"}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Created By {studentViewCourseDetails?.instructorName}</span>
                    <span>
                        Created On{" "}
                        {studentViewCourseDetails?.date?.split("T")[0] || "N/A"}
                    </span>
                    <span className="flex items-center">
                        <Globe className="mr-1 h-4 w-4" />
                        {studentViewCourseDetails?.primaryLanguage || "Language"}
                    </span>
                    <span>
                        {studentViewCourseDetails?.students?.length || 0}{" "}
                        {studentViewCourseDetails?.students?.length === 1
                            ? "student"
                            : "students"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What you'll learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {studentViewCourseDetails?.objectives
                                    ?.split(",")
                                    .map((objective, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span>{objective}</span>
                                        </li>
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentViewCourseDetails?.curriculum?.map(
                                (curriculumItem, index) => (
                                    <li
                                        key={index}
                                        className={`${
                                            curriculumItem?.freePreview
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed"
                                        } flex items-center mb-4`}
                                        onClick={
                                            curriculumItem?.freePreview
                                                ? () =>
                                                      handleSetFreePreview(
                                                          curriculumItem
                                                      )
                                                : null
                                        }
                                    >
                                        {curriculumItem?.freePreview ? (
                                            <PlayCircle className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Lock className="mr-2 h-4 w-4" />
                                        )}
                                        <span>{curriculumItem?.title}</span>
                                    </li>
                                )
                            )}
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <VideoPlayer
                                    url={
                                        freePreviewItem?.videoUrl || ""
                                    }
                                    width="450px"
                                    height="200px"
                                />
                            </div>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    ${studentViewCourseDetails?.pricing}
                                </span>
                            </div>
                            <Button
                                onClick={handleCreatePayment}
                                className="w-full"
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            {showFreePreviewDialog && (
                <Dialog
                    open={showFreePreviewDialog}
                    onOpenChange={() => {
                        setShowFreePreviewDialog(false);
                        setDisplayCurrentVideoFreePreview(null);
                    }}
                >
                    <DialogTitle>Course Preview</DialogTitle>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="450px"
                            height="200px"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setShowFreePreviewDialog(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </div>
    );
}

function SkeletonLoading() {
    return (
        <div className="p-8">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-6" />
            <Skeleton className="h-32 w-full" />
        </div>
    );
}

export default StudentViewCourseDetailsPage;

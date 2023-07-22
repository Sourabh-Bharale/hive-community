import CloseModal from "@/components/CloseModal"
import SignIn from "@/components/SignIn"


export default function page(){
    return (
        <div className="fixed inset-0 backdrop-blur-2xl  z-10 ">
            <div className="container flex items-center h-full max-w-lg mx-auto">
                <div className="relative w-full h-fit py-12 px-2 rounded-lg">
                    <div className="absolute top-0 right-4">
                        <CloseModal/>
                    </div>
                    <SignIn/>
                </div>
            </div>
        </div>
    )
}
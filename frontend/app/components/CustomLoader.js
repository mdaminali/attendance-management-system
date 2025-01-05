import Image from "next/image"
import spinner from "@/public/spinner.gif"

export default function CustomLoader() {
	return (
		<div className="flex p-5 justify-center flex-col items-center">
			{/* <Spinner className="h-8 w-8" /> */}
			<Image className="block mb-2" src={spinner} alt="" width={30} height={30} />
			<h1 className="text-orange-500 text-lg">Loading. Please wait...</h1>
		</div>
	)
}

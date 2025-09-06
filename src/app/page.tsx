import { getAllADRs } from "@/lib/staticGeneration";
import { HomePageContent } from "./HomePageContent";

export default async function Home() {
	const { directory } = await getAllADRs();

	return <HomePageContent directory={directory} />;
}

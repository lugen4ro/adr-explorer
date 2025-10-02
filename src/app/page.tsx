import { FileService } from "@/services/fileService";
import { HomePageContent } from "./HomePageContent";

export default async function Home() {
  const fileService = new FileService("adr");
  const { directory } = await fileService.getAllADRs();

  return <HomePageContent directory={directory} />;
}

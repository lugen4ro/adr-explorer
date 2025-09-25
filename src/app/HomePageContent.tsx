"use client";

import type React from "react";
import { HomePage } from "@/components/HomePage";
import type { ADRDirectory } from "@/types/adr";

interface HomePageContentProps {
  directory: ADRDirectory;
}

export const HomePageContent: React.FC<HomePageContentProps> = ({ directory }) => {
  return <HomePage directory={directory} />;
};

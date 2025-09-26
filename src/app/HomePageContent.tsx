"use client";

import type React from "react";
import { ADRHomePage } from "@/components";
import type { ADRDirectory } from "@/types/adr";

interface HomePageContentProps {
  directory: ADRDirectory;
}

export const HomePageContent: React.FC<HomePageContentProps> = ({
  directory,
}) => {
  return <ADRHomePage directory={directory} />;
};

"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { connectToYellow } from "@/yellow/yellow";








export default function Home() {
 
  redirect("/user/projects");
  // return <div>Home</div>;
}

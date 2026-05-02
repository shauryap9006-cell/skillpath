import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Career Path | SkillPath",
  description: "Track your progress, manage your skill gaps, and stay on top of your personalized learning roadmap.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

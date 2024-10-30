import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  return (
    <div>
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
        <DarkModeToggle />
      </div>
    </div>
  );
}
